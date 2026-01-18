import React from 'react';
import { InstagramData } from '../types';
import { Card, Button } from './UI';
import { EngagementTrendChart, PostPerformanceChart, ContentTypeChart } from './Charts';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Activity,
  PlayCircle,
  Video,
  Eye
} from 'lucide-react';

interface DashboardProps {
  data: InstagramData;
  onBack: () => void;
}

const formatNumber = (num: number): string => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const MetricCard: React.FC<{ 
  label: string; 
  value: string | number; 
  icon: React.ReactNode; 
  trend?: string 
}> = ({ label, value, icon, trend }) => (
  <Card className="flex flex-col justify-between h-full bg-brand-dark border border-gray-800">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-brand-yellow/10 rounded-xl text-brand-yellow">
        {icon}
      </div>
    </div>
    <div>
      <h4 className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wide">{label}</h4>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ data, onBack }) => {
  const { profile, analytics, posts } = data;

  return (
    <div className="min-h-screen bg-brand-black text-white pb-12">
      {/* Top Navigation Bar */}
      <nav className="border-b border-gray-800 bg-brand-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-bold">
              Insta<span className="text-brand-yellow">lytics</span>
            </span>
          </div>
          <div className="flex items-center bg-gray-900 rounded-full px-4 py-1.5 border border-gray-700">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-white">Live Analysis</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Simplified Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between bg-brand-dark p-8 rounded-2xl border border-gray-800">
          <div className="flex items-center space-x-6">
            {/* Generated Avatar since no URL provided */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-yellow to-yellow-600 flex items-center justify-center text-black font-bold text-3xl shadow-lg shadow-yellow-500/20">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">@{profile.username}</h1>
              <p className="text-gray-400">Instagram Analytics Report</p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex space-x-8 text-center bg-black/20 px-8 py-4 rounded-xl border border-gray-800">
            <div>
              <p className="text-2xl font-bold text-white">{posts.length}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold">Posts Analyzed</p>
            </div>
            <div className="w-px bg-gray-700"></div>
            <div>
              <p className="text-2xl font-bold text-brand-yellow">{formatNumber(analytics.total_engagements)}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Interactions</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              label="Avg. Views" 
              value={formatNumber(analytics.avg_views)} 
              icon={<Eye className="w-6 h-6" />}
            />
            <MetricCard 
              label="Avg. Likes" 
              value={formatNumber(analytics.avg_likes)} 
              icon={<Heart className="w-6 h-6" />}
            />
            <MetricCard 
              label="Avg. Comments" 
              value={formatNumber(analytics.avg_comments)} 
              icon={<MessageCircle className="w-6 h-6" />}
            />
            <MetricCard 
              label="Avg. Engagement" 
              value={`${analytics.overall_engagement_rate.toFixed(1)}%`} 
              icon={<Activity className="w-6 h-6" />}
            />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" title="Engagement Trends">
            <div className="h-72">
              <EngagementTrendChart posts={posts} />
            </div>
          </Card>
          
          <Card className="lg:col-span-1" title="Top Performing Post">
             {analytics.best_post && (() => {
               const best = posts.find(p => p.id === analytics.best_post!.id);
               if (!best) return <div className="p-4 text-gray-500">Data unavailable</div>;
               
               return (
                 <div className="relative group overflow-hidden rounded-xl mt-2 border border-gray-700">
                    <div className="aspect-[4/5] w-full bg-gray-900 relative">
                       {/* Use video tag since input is videoUrl */}
                       <video 
                         src={best.media_url} 
                         className="w-full h-full object-cover opacity-80"
                         muted
                         loop
                         playsInline
                         onMouseOver={e => e.currentTarget.play()}
                         onMouseOut={e => e.currentTarget.pause()}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5">
                         <div className="flex items-center space-x-1 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-2">
                            <TrendingUp className="w-3 h-3" />
                            <span>Highest Engagement</span>
                         </div>
                         <p className="text-white text-sm line-clamp-2 mb-4 font-medium leading-relaxed">{best.caption}</p>
                         <div className="flex items-center justify-between border-t border-white/10 pt-3">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center text-sm font-semibold text-white">
                                <Heart className="w-4 h-4 mr-1.5 text-brand-yellow fill-brand-yellow" /> {formatNumber(best.likes)}
                              </span>
                              <span className="flex items-center text-sm font-semibold text-white">
                                <MessageCircle className="w-4 h-4 mr-1.5 text-gray-400" /> {formatNumber(best.comments)}
                              </span>
                            </div>
                            <span className="flex items-center text-sm font-semibold text-white">
                                <Eye className="w-4 h-4 mr-1.5 text-gray-400" /> {formatNumber(best.views || 0)}
                            </span>
                         </div>
                       </div>
                    </div>
                 </div>
               );
             })()}
          </Card>
        </div>

         {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="lg:col-span-2" title="Engagement Breakdown (Likes vs Comments)">
              <div className="h-72">
                 <PostPerformanceChart posts={posts} />
              </div>
           </Card>

           <Card title="Content Type" className="lg:col-span-1">
             <div className="h-72">
               <ContentTypeChart posts={posts} />
             </div>
          </Card>
        </div>

        {/* Recent Posts Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-white flex items-center">
                <Video className="w-5 h-5 mr-2 text-brand-yellow" />
                Latest Videos
             </h3>
             <span className="text-sm text-gray-500">Based on last {posts.length} posts</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="group relative aspect-[9/16] bg-gray-800 rounded-xl overflow-hidden border border-gray-800 hover:border-brand-yellow transition-all duration-300 shadow-lg">
                <video 
                  src={post.media_url} 
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onMouseOver={e => e.currentTarget.play()}
                  onMouseOut={e => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-3 p-2">
                  <div className="flex flex-col items-center">
                    <Heart className="w-6 h-6 text-brand-yellow fill-brand-yellow mb-1" />
                    <span className="font-bold text-white">{formatNumber(post.likes)}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Eye className="w-6 h-6 text-white mb-1" />
                    <span className="font-bold text-white text-sm">{formatNumber(post.views || 0)}</span>
                  </div>
                </div>
                
                {/* Play Icon Indicator */}
                <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm p-1.5 rounded-full">
                   <PlayCircle className="w-3 h-3 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;