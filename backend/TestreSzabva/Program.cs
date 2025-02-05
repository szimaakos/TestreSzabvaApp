using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TestreSzabva.Data;
using TestreSzabva.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Adatb�zis-szolg�ltat�s regisztr�l�sa (SQLite)
builder.Services.AddDbContext<TestreSzabvaContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. CORS be�ll�t�sa
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policyBuilder =>
    {
        policyBuilder
            .WithOrigins("http://localhost:5173") // Fejleszt�sben a React alap�rtelmezett portja
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// 3. Identity + EF store + jelsz� szab�lyok
builder.Services.AddIdentity<Felhasznalo, IdentityRole>(options =>
{
    // Jelsz� szab�lyok �les k�rnyezethez
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<TestreSzabvaContext>()
.AddDefaultTokenProviders();

// 4. JWT Auth
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
})
.AddJwtBearer("Bearer", options =>
{
    options.RequireHttpsMetadata = true; // �les k�rnyezetben HTTPS sz�ks�ges
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// 5. MVC/Web API szolg�ltat�sok
builder.Services.AddControllers();

// 6. Swagger (Csak fejleszt�si k�rnyezetben)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "TestreSzabva API",
        Version = "v1"
    });
});

var app = builder.Build();

// 7. Middleware konfigur�ci�
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactPolicy");

// FONTOS: El�sz�r Auth, azt�n Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// SeedData csak fejleszt�si k�rnyezetben
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<TestreSzabvaContext>();
            context.Database.Migrate(); // Lefuttatja a migr�ci�kat
            SeedData.Initialize(context); // Seed data bet�lt�se
        }
        catch (Exception ex)
        {
            // Logolhatod a hib�t vagy kezelheted
            Console.WriteLine($"Hiba a seeding sor�n: {ex.Message}");
        }
    }
}

app.Run();