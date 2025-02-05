var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// added CORS because backend and React run on different ports
builder.Services.AddCors(options => 
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("https://localhost:58862")
               .AllowAnyMethod() 
               .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();