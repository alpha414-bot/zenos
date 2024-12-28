import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserCheck, FaUserClock } from 'react-icons/fa';
import { firestore } from '@/firebase-config';
import { collection, query, getDocs, onSnapshot, Timestamp } from 'firebase/firestore';

interface UserData {
  admin: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  displayName: string;
  email: string;
  first_name: string;
  last_name: string;
  isAnonymous: boolean;
  phone: string;
  uid: string;
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
  username: string;
}

interface UserStats {
  totalUsers: number;
  adminUsers: number;
  newUsers: number;
}

const AdminUsersComponent = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    adminUsers: 0,
    newUsers: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const usersCollection = collection(firestore, "users");
        
        const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
          console.log('Snapshot received, document count:', snapshot.size);
          
          const users = snapshot.docs.map(doc => {
            const data = doc.data() as UserData;
            return {
              ...data,
              id: doc.id,
              createdAtDate: new Date(data.createdAt.seconds * 1000)
            };
          });

          // Get current date for new users calculation
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          // Calculate stats
          const totalUsers = users.length;
          const adminUsers = users.filter(user => user.admin === true).length;
          const newUsers = users.filter(user => user.createdAtDate > thirtyDaysAgo).length;

          console.log('Calculated stats:', {
            totalUsers,
            adminUsers,
            newUsers,
          });

          setStats({
            totalUsers,
            adminUsers,
            newUsers
          });

          setLoading(false);
        }, (error) => {
          console.error('Snapshot listener error:', error);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error in fetchUserStats:', error);
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <section data-scroll data-scroll-speed=".1" id="AdminUsersSection">
      <div className="pb-2 border-b-2 border-gray-500 mb-4">
        <h4 className="text-3xl font-bold text-gray-800">Users Overview</h4>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-full">
                <FaUsers className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalUsers.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Admin Users */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-full">
                <FaUserCheck className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Admin Users</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.adminUsers.toLocaleString()}
                </h3>
                <p className="text-xs text-gray-400">
                  {stats.totalUsers > 0 ? ((stats.adminUsers / stats.totalUsers) * 100).toFixed(1) : '0'}% of total
                </p>
              </div>
            </div>
          </div>

          {/* New Users (Last 30 Days) */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 rounded-full">
                <FaUserClock className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">New Users (30d)</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.newUsers.toLocaleString()}
                </h3>
                <p className="text-xs text-gray-400">
                  {stats.totalUsers > 0 ? ((stats.newUsers / stats.totalUsers) * 100).toFixed(1) : '0'}% of total
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminUsersComponent;