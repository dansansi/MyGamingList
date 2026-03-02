using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Writers;
using MyGamingListAPI.Data;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Implementations;
using MyGamingListAPI.Services.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Digite seu token sem espaços ou aspas."
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true;

}).
    AddEntityFrameworkStores<AppDbContext>().
    AddDefaultTokenProviders();

builder.Services.AddHttpClient<IRawgApiService, RawgApiService>(client =>
{
    client.BaseAddress = new Uri("https://api.rawg.io/api/");
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddTransient<IUserGameService, UserGameService>();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
    };
}); 

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    string[] roles = ["Admin", "User"];



    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

    //Sim, eu vou deixar os dois pra lembrar dessa sintaxe que eu sempre esqueço :p
    var adminUsername = builder.Configuration.GetSection("AdminSettings")["User"]!;
    var adminEmail = builder.Configuration["AdminSettings:Email"]!;
    var adminPass = builder.Configuration["AdminSettings:Password"]!;

    var admin = new AppUser
    {
        UserName = adminUsername,
        Email = adminEmail
    };

    if (await userManager.FindByNameAsync(adminUsername) == null)
    {
        var createResult = await userManager.CreateAsync(admin, adminPass);
        if (createResult.Succeeded) {

            Console.WriteLine("Usuario criado.");
        var createUserRole = await userManager.AddToRoleAsync(admin, "Admin");
            if (!createUserRole.Succeeded)
            {
                foreach (var erro in createUserRole.Errors)
                {
                    Console.WriteLine($"Colocando Role. {erro.Code} - {erro.Description}");
                }
            }
            Console.WriteLine("setado como admin.");
        }
        else
        {
            foreach (var erro in createResult.Errors)
            {
                Console.WriteLine($"Criando Admin. {erro.Code} - {erro.Description}");
            }
        }
    }
}

app.Run();