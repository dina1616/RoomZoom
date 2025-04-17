export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About RoomZoom</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            RoomZoom was created with a simple mission: to make student housing in London easier to find, more affordable, and more transparent. We believe that every student deserves a safe, comfortable place to live while pursuing their education.
          </p>
          <p className="text-gray-700">
            Our platform connects students directly with verified landlords and property managers, eliminating the middleman and reducing costs for everyone involved.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-4 text-gray-700">
            <li>
              <strong>Find Properties</strong> - Browse our extensive database of student accommodations near major London universities.
            </li>
            <li>
              <strong>Connect with Landlords</strong> - Message property owners directly through our secure platform.
            </li>
            <li>
              <strong>Schedule Viewings</strong> - Arrange virtual or in-person tours of your favorite properties.
            </li>
            <li>
              <strong>Read Reviews</strong> - Learn from other students' experiences before making your decision.
            </li>
            <li>
              <strong>Secure Your Home</strong> - Once you've found the perfect place, complete your booking through our secure system.
            </li>
          </ol>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-4">
            RoomZoom was founded by a group of former London students who experienced firsthand the challenges of finding suitable accommodation in the city. Our team combines expertise in real estate, technology, and student services to create the best possible platform for student housing.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            We're always looking to improve our service. If you have questions, suggestions, or need assistance, please don't hesitate to get in touch.
          </p>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-700 mb-2"><strong>Email:</strong> support@roomzoom.example.com</p>
            <p className="text-gray-700 mb-2"><strong>Phone:</strong> +44 20 1234 5678</p>
            <p className="text-gray-700"><strong>Address:</strong> 123 Student Street, London, UK</p>
          </div>
        </section>
      </div>
    </div>
  );
} 