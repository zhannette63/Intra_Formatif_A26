using Dessins.Events;
using Microsoft.AspNetCore.Mvc;

namespace Dessins.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class DessinsController : ControllerBase
    {
        [HttpGet]
        // Rien à modifier ici, juste un exemple de dessin très simple
        public ActionResult GetDrawing1()
        {
            var drawSquare = new DrawSquare(2, 2);
            
            return Ok(drawSquare);
        }

        // TODO: Il faut ajouter une nouvelle action pour dessiner la séquence mentionnée dans l'énoncé
        [HttpGet]
        public ActionResult GetDrawing2()
        {
            var drawCircle = new DrawCircle(1, 1);
            var wait3Sec = new Wait(3);
            var redColor = new ChangeColor("red");
            var drawSquare1 = new DrawSquare(0, 2);
            var drawSquare2 = new DrawSquare(2, 2);
            var wait1Sec = new Wait(1);
            var yellowColor = new ChangeColor("yellow");
            var drawStar = new DrawStar(1, 3,20);
            
            

       
            yellowColor.DrawingEvents.Add(drawStar);

            wait1Sec.DrawingEvents.Add(yellowColor);

            drawSquare2.DrawingEvents.Add(wait1Sec);

            
            drawSquare1.DrawingEvents.Add(drawSquare2);

            
            redColor.DrawingEvents.Add(drawSquare1);

            wait3Sec.DrawingEvents.Add(redColor);

            drawCircle.DrawingEvents.Add(wait3Sec);

            return Ok(drawCircle);
        }
    }
}
