import { User, Mail, Briefcase, Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-32"></div>
          
          {/* Profile Content */}
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <User size={64} className="text-primary-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
            <p className="text-gray-600 mb-6">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                {user?.role?.toUpperCase()}
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 text-gray-700">
                <Mail className="text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              {user?.department && (
                <div className="flex items-center space-x-3 text-gray-700">
                  <Briefcase className="text-primary-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{user?.department}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 text-gray-700">
                <Calendar className="text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {user?.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
