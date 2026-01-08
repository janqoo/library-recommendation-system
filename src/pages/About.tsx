import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">About LibraryAI</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Your intelligent companion for discovering and organizing your next great read
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission Section */}
          <div className="glass-effect rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              LibraryAI is designed to revolutionize how you discover and manage your reading journey. 
              We combine the power of artificial intelligence with intuitive design to help you find 
              books that truly resonate with your interests, mood, and reading goals.
            </p>
          </div>

          {/* Features Section */}
          <div className="glass-effect rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Key Features</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">AI-Powered Recommendations</h3>
                    <p className="text-sm text-slate-600">Get personalized book suggestions based on your reading history and preferences</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Smart Reading Lists</h3>
                    <p className="text-sm text-slate-600">Organize your books into custom lists with intelligent categorization</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Favorites Collection</h3>
                    <p className="text-sm text-slate-600">Save and quickly access your favorite books with one click</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Secure Authentication</h3>
                    <p className="text-sm text-slate-600">Your data is protected with enterprise-grade security</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Beautiful Interface</h3>
                    <p className="text-sm text-slate-600">Enjoy a modern, intuitive design that makes browsing a pleasure</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Cross-Platform</h3>
                    <p className="text-sm text-slate-600">Access your library from any device, anywhere</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Section */}
          <div className="glass-effect rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Built with Modern Technology</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              LibraryAI is built using cutting-edge technologies to ensure a fast, reliable, and scalable experience:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">React</div>
                <div className="text-sm text-slate-600">Modern Frontend</div>
              </div>
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">AWS</div>
                <div className="text-sm text-slate-600">Cloud Infrastructure</div>
              </div>
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">AI/ML</div>
                <div className="text-sm text-slate-600">Smart Recommendations</div>
              </div>
            </div>
          </div>

          {/* Student Project Section */}
          <div className="glass-effect rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Educational Project</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              This application was created as part of a university computer science project to demonstrate 
              modern web development practices, cloud computing, and AI integration. It showcases the 
              implementation of a full-stack application using industry-standard tools and best practices.
            </p>
          </div>

          {/* Contact Section */}
          <div className="glass-effect rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Get Started Today</h2>
            <p className="text-slate-600 mb-6">
              Ready to discover your next favorite book? Join LibraryAI and start your personalized reading journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Sign Up Free
              </Link>
              <Link
                to="/books"
                className="inline-flex items-center px-6 py-3 bg-white text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-all border border-violet-200 hover:border-violet-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}