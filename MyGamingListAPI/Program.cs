using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyGamingListAPI.Data;
using MyGamingListAPI.Jobs;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Implementations;
using MyGamingListAPI.Services.Interfaces;
using System.Text;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
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
            Array.Empty<string>()
        }
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://mygaminglist-ielz.onrender.com").
        AllowAnyHeader().
        AllowCredentials().
        AllowAnyMethod();
    });
});
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = true;

}).
    AddEntityFrameworkStores<AppDbContext>().
    AddDefaultTokenProviders();

builder.Services.AddHttpClient<IRawgApiService, RawgApiService>(client =>
{
    client.BaseAddress = new Uri("https://api.rawg.io/api/");
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IHomeGamesService, HomeGamesService>();
builder.Services.AddHostedService<HomeGamesSyncJob>();
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

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["token"];
            return Task.CompletedTask;


        },
        OnAuthenticationFailed = context =>
        {
            return Task.CompletedTask;
        }
    };
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseStaticFiles();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MyGamingList API v1");
        c.InjectStylesheet("/SwaggerUi/SwaggerDark.css");
    });
}
app.UseCors("AllowFrontend");

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

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();