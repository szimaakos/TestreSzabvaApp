using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestreSzabva.Data;
using TestreSzabva.Models;

namespace TestreSzabva.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HetiEtrendController : ControllerBase
    {
        private readonly TestreSzabvaContext _context;

        public HetiEtrendController(TestreSzabvaContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEtrend(int id)
        {
            var etrend = await _context.HetiEtrendek
                .Include(e => e.Etel)
                .Include(e => e.Felhasznalo)
                .FirstOrDefaultAsync(e => e.PlanId == id);

            if (etrend == null)
            {
                return NotFound();
            }

            return Ok(etrend);
        }

        [HttpGet("Felhasznalo/{userId}")]
        public async Task<IActionResult> GetEtrendByUser(string userId)
        {
            var etrendek = await _context.HetiEtrendek
                .Where(e => e.UserId == userId)
                .Include(e => e.Etel)
                .Select(e => new {
                    e.PlanId,
                    e.UserId, // Gondoskodj róla, hogy ez szerepeljen
                    e.DayOfWeek,
                    e.MealTime,
                    e.FoodId,
                    e.Quantity,
                    e.TotalCalories,
                    Etel = new
                    {
                        e.Etel.FoodId,
                        e.Etel.Name,
                        e.Etel.Calories,
                        e.Etel.Protein,
                        e.Etel.Carbs,
                        e.Etel.Fats
                    }
                })
                .ToListAsync();

            return Ok(etrendek);
        }



        [HttpPost]
        public async Task<IActionResult> CreateEtrend([FromBody] CreateHetiEtrendDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var etrend = new HetiEtrend
            {
                UserId = dto.UserId,
                DayOfWeek = dto.DayOfWeek,
                MealTime = dto.MealTime,
                FoodId = dto.FoodId,
                Quantity = dto.Quantity,
                TotalCalories = dto.TotalCalories
            };

            _context.HetiEtrendek.Add(etrend);
            await _context.SaveChangesAsync();

            // Betöltjük az Etel navigációs tulajdonságot
            await _context.Entry(etrend).Reference(e => e.Etel).LoadAsync();

            return CreatedAtAction(nameof(GetEtrend), new { id = etrend.PlanId }, etrend);
        }




        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEtrend(int id, [FromBody] UpdateHetiEtrendDto dto)
        {
            if (id != dto.PlanId)
            {
                return BadRequest("Az ID nem egyezik.");
            }

            var etrend = await _context.HetiEtrendek.FindAsync(id);
            if (etrend == null)
            {
                return NotFound();
            }

            // Frissítjük a primitív mezőket
            etrend.UserId = dto.UserId;
            etrend.DayOfWeek = dto.DayOfWeek;
            etrend.MealTime = dto.MealTime;
            etrend.FoodId = dto.FoodId;
            etrend.Quantity = dto.Quantity;
            etrend.TotalCalories = dto.TotalCalories;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtrend(int id)
        {
            var etrend = await _context.HetiEtrendek.FindAsync(id);
            if (etrend == null)
            {
                return NotFound();
            }

            _context.HetiEtrendek.Remove(etrend);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
