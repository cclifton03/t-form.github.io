...{
    public class Venue
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public BaseLocation LocationInfo { get; set; }
        public LookUp VenueType { get; set; }
        public string FileImageUrl { get; set; }
        public string Url { get; set; }
        public BaseUser CreatedBy { get; set; }
        public BaseUser ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModifed { get; set; }
    }
}
