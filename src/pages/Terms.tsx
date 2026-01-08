import { Link } from 'react-router-dom';

export function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-6">
              This is a student project for educational purposes. These terms are placeholder content.
            </p>
            
            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-4">
              By using this library recommendation system, you agree to these terms of service.
            </p>
            
            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Educational Use</h2>
            <p className="text-slate-600 mb-4">
              This application is created for educational purposes as part of a university project.
            </p>
            
            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Data Usage</h2>
            <p className="text-slate-600 mb-4">
              User data is stored securely using AWS services and is used only for the functionality of this application.
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