using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TestreSzabva.Models;

namespace TestreSzabva.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FelhasznaloController : ControllerBase
    {
        private readonly UserManager<Felhasznalo> _userManager;
        private readonly SignInManager<Felhasznalo> _signInManager;
        private readonly IConfiguration _configuration;

        public FelhasznaloController(
            UserManager<Felhasznalo> userManager,
            SignInManager<Felhasznalo> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        // ====== REGISTER (meglévő metódus) ======
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Ellenőrizzük, hogy létezik-e már a felhasználó az adott e-maillel.
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return Conflict("Email already in use.");
            }

            // Létrehozzuk az Identity felhasználót
            var user = new Felhasznalo
            {
                UserName = dto.UserName,
                Email = dto.Email,
                Weight = dto.Weight,
                Height = dto.Height,
                Age = dto.Age,
                Gender = dto.Gender,
                ActivityLevel = dto.ActivityLevel,
                GoalWeight = dto.GoalWeight
            };

            // A nyers jelszót itt adjuk meg
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Dönthetsz úgy, hogy regisztrációnál rögtön adsz vissza JWT tokent
            // (az alábbi 2 sor is egy lehetséges megoldás):
            // var token = GenerateJwtToken(user);
            // return Ok(new { Token = token });

            // Vagy maradhat a jelenlegi CreatedAtAction:
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // ====== LOGIN (új metódus) ======
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Kikeressük a felhasználót email alapján
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return Unauthorized("Hibás email vagy jelszó.");
            }

            // Ellenőrizzük a jelszót
            var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passwordValid)
            {
                return Unauthorized("Hibás email vagy jelszó.");
            }

            // Ha minden rendben, generálunk egy JWT tokent
            var token = GenerateJwtToken(user);

            // Visszaküldjük a tokent a kliensnek
            return Ok(new { Token = token });
        }

        // ====== GET BY ID (meglévő metódus) ======
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // ====== UPDATE USER (meglévő metódus) ======
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] Felhasznalo updatedUser)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Weight = updatedUser.Weight;
            user.Height = updatedUser.Height;
            user.Age = updatedUser.Age;
            user.Gender = updatedUser.Gender;
            user.ActivityLevel = updatedUser.ActivityLevel;
            user.GoalWeight = updatedUser.GoalWeight;

            // Itt is bővíthető, ha emailt vagy jelszót is módosítani kell
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        // ====== DELETE USER (meglévő metódus) ======
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        // ====== JWT TOKEN GENERÁLÁSA (segédfüggvény) ======
        private string GenerateJwtToken(Felhasznalo user)
        {
            // A tokenbe felvett claim-eket igény szerint bővítheted (pl. role)
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                // Ide tehetsz pl. new Claim("custom_claim", "érték") formátumot is
            };

            // Kulcs beolvasása az appsettingsből
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])
            );
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Token lejárati ideje, issuer, audience
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = creds
            };

            // Token elkészítése
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(securityToken);
        }
    }

    // ====== LOGIN Dto ======
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
