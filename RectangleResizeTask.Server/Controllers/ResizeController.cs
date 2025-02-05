using Microsoft.AspNetCore.Mvc;
using System.Xml;
using static RectangleResizeTask.Server.Rectangle;
using System.Text.Json;
namespace RectangleResizeTask.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ResizeController : ControllerBase
    {
        private readonly string jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "rectangle.json");
        [HttpPost("rectangle-validation")]
        public IActionResult ResizeRectangle([FromBody] Rectangle rectangle)
        {
            try
            {
                if (rectangle == null)
                {
                    return BadRequest("Invalid rectangle data.");
                }
                else
                {
                    var jsonData = System.IO.File.ReadAllText(jsonFilePath);

                    var currentData = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(jsonData);

                    currentData["width"] = JsonSerializer.SerializeToElement(rectangle.width);
                    currentData["height"] = JsonSerializer.SerializeToElement(rectangle.height);
                    currentData["x"] = JsonSerializer.SerializeToElement(rectangle.x);
                    currentData["y"] = JsonSerializer.SerializeToElement(rectangle.y);
                    var updatedJsonData = JsonSerializer.Serialize(currentData, new JsonSerializerOptions { WriteIndented = true });

                    System.IO.File.WriteAllText(jsonFilePath, updatedJsonData);
                    if (!rectangle.dragged)
                    {
                        if (rectangle.width <= rectangle.height)
                        {
                            return Ok("Rectangle is valid");
                        }
                        else
                        {
                            return BadRequest("Rectangle width exceeds height");
                        }
                    }
                    return Ok();
                }

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);

            }
        }
        [HttpGet("returnFigure")]
        public IActionResult ReturnFigure()
        {
            try
            {
                var jsonData = System.IO.File.ReadAllText(jsonFilePath);
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
