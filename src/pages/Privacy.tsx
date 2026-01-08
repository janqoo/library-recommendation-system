import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-6">
              This is a student project for educational purposes. This privacy policy is placeholder content.
            </p>
            
            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
            <p className="text-slate-600 mb-4">
              We collect basic account information (name, email) and reading preferences to provide book recommendations.
            </p>
            
            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-600 mb-4">
              Your information is used to provide personalized book recommendations and manage your reading lists.
            </p>
            
            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Data Security</h2>
            <p className="text-slate-600 mb-4">
              We use AWS security best practices to protect your data, including encryption and secure authentication.
            </p>
            
            <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Educational Purpose</h2>
            <p className="text-slate-600 mb-4">
              This application is created for educational purposes. Data may be used for learning and demonstration purposes.
            </p>
            
            <div className="mt-8 pt-6 border-t border-slate-200">
              <Link 
                to="/signup" 
                className="text-violet-600 hover:text-violet-700 font-medium"
              >
                ← Back to Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}