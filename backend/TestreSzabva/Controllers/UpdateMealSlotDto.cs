using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class UpdateMealSlotDto
{
    [Required]
    public int PlanId { get; set; }

    [Required]
    public string UserId { get; set; }

    [Required]
    public string DayOfWeek { get; set; }

    [Required]
    public string MealTime { get; set; }

    public List<UpdateMealFoodDto> MealFoods { get; set; } = new List<UpdateMealFoodDto>();
}

public class UpdateMealFoodDto
{
    // Ha létezik már a rekord, akkor opcionálisan tartalmazhatja az Id-t
    public int? Id { get; set; }

    [Required]
    public int FoodId { get; set; }

    [Required]
    [Range(1, 500)]
    public float Quantity { get; set; }

    [Required]
    public float TotalCalories { get; set; }
}
