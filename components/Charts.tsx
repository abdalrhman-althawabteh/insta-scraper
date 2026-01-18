import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { InstagramPost } from '../types';

interface EngagementChartProps {
  posts: InstagramPost[];
}

export const EngagementTrendChart: React.FC<EngagementChartProps> = ({ posts }) => {
  // Reverse posts to show chronological order left-to-right if input is newest-first
  const data = [...posts].reverse().map((post, index) => ({
    name: `Post ${index + 1}`,
    likes: post.likes,
    comments: post.comments,
    engagement: post.engagement_rate
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#666" 
          tick={{ fill: '#666', fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#666" 
          tick={{ fill: '#666', fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#999' }}
        />
        <Line 
          type="monotone" 
          dataKey="likes" 
          stroke="#FFD700" 
          strokeWidth={3} 
          dot={{ fill: '#111', stroke: '#FFD700', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 8, fill: '#FFD700' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const PostPerformanceChart: React.FC<EngagementChartProps> = ({ posts }) => {
  const data = posts.slice(0, 10).map((post, i) => ({
    name: `P${i + 1}`,
    likes: post.likes,
    comments: post.comments
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#666" 
          tick={{ fill: '#666', fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#666" 
          tick={{ fill: '#666', fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          cursor={{ fill: '#ffffff05' }}
          contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
        />
        <Bar dataKey="likes" fill="#FFD700" radius={[4, 4, 0, 0]} />
        <Bar dataKey="comments" fill="#FFF" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ContentTypeChart: React.FC<EngagementChartProps> = ({ posts }) => {
  const counts = posts.reduce((acc, post) => {
    acc[post.media_type] = (acc[post.media_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(counts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const COLORS = ['#FFD700', '#FFFFFF', '#666666'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#999' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};
