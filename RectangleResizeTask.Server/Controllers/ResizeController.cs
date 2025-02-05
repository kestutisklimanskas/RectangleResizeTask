using Microsoft.AspNetCore.Mvc;
using System.Xml;
using static RectangleResizeTask.Server.Rectangle;
using System.Text.Json;
using System.Security.Cryptography.X509Certificates;
namespace RectangleResizeTask.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ResizeController : ControllerBase
    {
        private readonly string jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "rectangle.json");
        [HttpPost("rectangle-validation")]
        public async Task<IActionResult> ResizeRectangle([FromBody] Rectangle rectangle)
        {
            try
            {
                if (rectangle == null)
                {
                    return BadRequest("Invalid rectangle data.");
                }
                else
                {
                    //waiting time for artificial delay
                    int waitingTime = 10000;

                    //finding the json file
                    var jsonData = System.IO.File.ReadAllText(jsonFilePath);
                    //deserializing JSON
                    var currentData = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(jsonData);
                    //adding received width, height and coordinates from Front-End
                    currentData["width"] = JsonSerializer.SerializeToElement(rectangle.width);
                    currentData["height"] = JsonSerializer.SerializeToElement(rectangle.height);
                    currentData["x"] = JsonSerializer.SerializeToElement(rectangle.x);
                    currentData["y"] = JsonSerializer.SerializeToElement(rectangle.y);
                    
                    //updating data
                    
                    var updatedJsonData = JsonSerializer.Serialize(currentData, new JsonSerializerOptions { WriteIndented = true });
                    
                    //saving changes

                    System.IO.File.WriteAllText(jsonFilePath, updatedJsonData);

                    // if the rectangle is dragged, then no need for the alerts and waiting

                    if (!rectangle.dragged)
                    {
                        //if the page is refreshed before the delay ends, then it gives an error

                        await Task.Delay(waitingTime);

                        //checking whether the width exceeds height

                        if (rectangle.width <= rectangle.height) 
                        {
                            return Ok("Rectangle is valid");
                        }
                        else
                        {
                            return BadRequest("Rectangle width exceeds height");
                        }
                    }
                    // returning true because of dragging event
                    return Ok(); 
                }

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);

            }
        }
        [HttpGet("returnFigure")]
        public async Task<IActionResult> ReturnFigure()
        {
            try
            {
                //reading text from Json file
                var jsonData = System.IO.File.ReadAllText(jsonFilePath);
                //if data is not null - return data
                if (jsonData != null)
                    return Ok(jsonData);
                else
                    return BadRequest("Could not retrieve data");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

    }
}
