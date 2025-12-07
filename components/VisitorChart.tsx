import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { format } from 'date-fns';

interface DailyVisit {
    date: string;
    count: number;
}

export function VisitorChart() {
    const [data, setData] = useState<DailyVisit[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/visit/history');
                // 날짜 포맷팅 (MM.dd)
                const formattedData = response.data.map((item: any) => ({
                    ...item,
                    shortDate: format(new Date(item.date), 'MM.dd')
                }));
                setData(formattedData);
            } catch (error) {
                console.error('Failed to fetch visitor history:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 pb-10">
            <Card className="max-w-4xl mx-auto shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        📊 일별 방문자 추이
                    </CardTitle>
                    <CardDescription>
                        최근 7일간의 방문자 수를 보여줍니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="shortDate"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ color: '#4F46E5', fontWeight: 600 }}
                                    active
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#4F46E5"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2 }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
