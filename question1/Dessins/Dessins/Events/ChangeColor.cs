namespace Dessins.Events
{
    public class ChangeColor : DrawingEvent
    {
        public override string Type { get { return "ChageColor"; } }
        public String Color { get; set; }

        public ChangeColor(String color )
        {
            Color = color;
        }
    }
}
