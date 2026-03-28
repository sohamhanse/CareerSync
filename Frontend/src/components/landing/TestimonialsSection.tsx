
import { Users, Briefcase, Star } from 'lucide-react';

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cobalt-400/50"></div>
            <h2 className="mx-4 text-sm uppercase tracking-wider text-cobalt-500 font-semibold">Testimonials</h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cobalt-400/50"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center text-cobalt-900">
            <Users className="mr-3 h-7 w-7 text-cobalt-500" />

            <span>
              Trusted by <span className="text-gradient ml-2">Thousands</span>{" "}of Job Seekers
            </span>
          </h2>
          <p className="text-cobalt-700/60 text-lg leading-relaxed">
            Don't just take our word for it. Here's what our users have to say about CareerSync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-cream-50 rounded-xl p-8 relative border border-cobalt-100/40 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-4 -left-2 text-5xl text-cobalt-500/30 font-serif">"</div>
            <div className="absolute top-4 right-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
            </div>
            <p className="text-cobalt-700/70 mb-8 leading-relaxed pt-6">
              CareerSync helped me land my dream job in just three weeks. The AI recommendations were spot-on and perfectly matched my skills!
            </p>
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full mr-4 flex items-center justify-center overflow-hidden border-2 border-cobalt">
                <img
                  src="/src/assets/testgurl1.jpg"  // replace with your image file
                  alt="logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-cobalt-900">Sarah Johnson</p>
                <p className="text-sm text-cobalt-500 flex items-center">
                  <Briefcase className="h-3 w-3 mr-1" /> UX Designer at TechCorp
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cream-50 rounded-xl p-8 relative border border-cobalt-100/40 hover:shadow-hover transition-all duration-300  hover:-translate-y-1">
            <div className="absolute -top-4 -left-2 text-5xl text-cobalt-500/30 font-serif">"</div>
            <div className="absolute top-4 right-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
            </div>
            <p className="text-cobalt-700/70 mb-8 leading-relaxed pt-6">
              The application tracking feature is a game-changer. I can finally keep track of everything in one place and never miss an important follow-up.
            </p>
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full mr-4 flex items-center justify-center overflow-hidden border-2 border-cobalt">
                <img
                  src="/src/assets/testboy1.jpeg"  // replace with your image file
                  alt="logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-cobalt-900">Michael Chen</p>
                <p className="text-sm text-cobalt-500 flex items-center">
                  <Briefcase className="h-3 w-3 mr-1" /> Software Engineer
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cream-50 rounded-xl p-8 relative border border-cobalt-100/40 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-4 -left-2 text-5xl text-cobalt-500/30 font-serif">"</div>
            <div className="absolute top-4 right-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
            </div>
            <p className="text-cobalt-700/70 mb-8 leading-relaxed pt-6">
              As a career changer, CareerSync's skill recommendations helped me identify transferable skills for my resume and highlight my unique strengths.
            </p>
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full mr-4 flex items-center justify-center overflow-hidden border-2 border-cobalt">
                <img
                  src="/src/assets/testgurl2.jpg"  // replace with your image file
                  alt="logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-cobalt-900">Emily Patel</p>
                <p className="text-sm text-cobalt-500 flex items-center">
                  <Briefcase className="h-3 w-3 mr-1" /> Marketing Specialist
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
