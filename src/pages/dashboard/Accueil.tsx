import React, { useEffect, useState } from 'react';
import { ElementType } from 'react';
import axios from 'axios';
import { 
  Box, Card, Typography, CircularProgress, 
  ToggleButton, ToggleButtonGroup, LinearProgress,
  Grid 
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell,
  Legend, AreaChart, Area, RadialBarChart, RadialBar 
} from 'recharts';
import { format, subDays } from 'date-fns';
import {
  ShoppingCart, People, Category, MonetizationOn, 
  TrendingUp, Inventory, Star, LocalShipping,
  PieChart as PieChartIcon, ShowChart, Equalizer
} from '@mui/icons-material';
import { orange, deepOrange, grey } from '@mui/material/colors';

interface Stats {
  products: number;
  carts: number;
  users: number;
  categories: string[];
  totalSales: number;
  averageOrderValue: number;
  salesData: any[];
  categoryDistribution: any[];
  topProducts: any[];
  deliveryStatus: any[];
  customerSatisfaction: number;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  delay, 
  trend,
  subtitle 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  delay: number;
  trend?: number;
  subtitle?: string;
}) => {
  const trendColor = trend ? (trend >= 0 ? '#4caf50' : '#f44336') : 'inherit';
  const trendIcon = trend ? (trend >= 0 ? '↑' : '↓') : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03 }}
    >
      <Card sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
        borderRadius: '12px',
        borderLeft: `4px solid ${orange[500]}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 30px 0 rgba(0,0,0,0.12)'
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1
        }}>
          <Box sx={{
            backgroundColor: orange[50],
            p: 1.5,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          {trend !== undefined && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: trendColor,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {trendIcon} {Math.abs(trend)}%
            </Typography>
          )}
        </Box>
        
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: '700',
            color: grey[800],
            mt: 1
          }}
        >
          {value}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: grey[600],
            fontWeight: '500',
            mt: 0.5
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: grey[500],
              display: 'block',
              mt: 0.5
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Card>
    </motion.div>
  );
};

const TimeFrameSelector = ({ timeFrame, onChange }: { timeFrame: string; onChange: (newTimeFrame: string) => void }) => (
  <ToggleButtonGroup
    value={timeFrame}
    exclusive
    onChange={(_: React.MouseEvent<HTMLElement>, value: string) => value && onChange(value)}
    sx={{ mb: 3 }}
  >
    <ToggleButton value="day" sx={{ 
      textTransform: 'none',
      '&.Mui-selected': { 
        backgroundColor: orange[500],
        color: 'white',
        '&:hover': { backgroundColor: orange[600] }
      }
    }}>Jour</ToggleButton>
    <ToggleButton value="week" sx={{ 
      textTransform: 'none',
      '&.Mui-selected': { 
        backgroundColor: orange[500],
        color: 'white',
        '&:hover': { backgroundColor: orange[600] }
      }
    }}>Semaine</ToggleButton>
    <ToggleButton value="month" sx={{ 
      textTransform: 'none',
      '&.Mui-selected': { 
        backgroundColor: orange[500],
        color: 'white',
        '&:hover': { backgroundColor: orange[600] }
      }
    }}>Mois</ToggleButton>
    <ToggleButton value="year" sx={{ 
      textTransform: 'none',
      '&.Mui-selected': { 
        backgroundColor: orange[500],
        color: 'white',
        '&:hover': { backgroundColor: orange[600] }
      }
    }}>Année</ToggleButton>
  </ToggleButtonGroup>
);

const SalesChart = ({ data }: { data: any[] }) => (
  <Card sx={{ 
    p: 3, 
    height: '100%',
    boxShadow: 'none',
    border: `1px solid ${grey[200]}`,
    borderRadius: '12px'
  }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 3,
      color: grey[800]
    }}>
      <ShowChart sx={{ mr: 1, color: orange[500] }} />
      <Typography variant="h6" sx={{ fontWeight: '600' }}>Évolution des ventes</Typography>
    </Box>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={orange[500]} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={orange[500]} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={grey[200]} />
        <XAxis 
          dataKey="x"
          tickFormatter={(value) => format(new Date(value), 'dd/MM')}
          tick={{ fill: grey[600] }}
          axisLine={{ stroke: grey[300] }}
        />
        <YAxis 
          tick={{ fill: grey[600] }}
          axisLine={{ stroke: grey[300] }}
        />
        <Tooltip 
          labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
          formatter={(value) => [`${value}€`, 'Ventes']}
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="y" 
          stroke={orange[500]} 
          fillOpacity={1} 
          fill="url(#colorSales)" 
          strokeWidth={2}
          activeDot={{ r: 6, stroke: orange[500], strokeWidth: 2, fill: 'white' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

const CategoryDistribution = ({ data }: { data: any[] }) => (
  <Card sx={{ 
    p: 3, 
    height: '100%',
    boxShadow: 'none',
    border: `1px solid ${grey[200]}`,
    borderRadius: '12px'
  }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 3,
      color: grey[800]
    }}>
      <PieChartIcon sx={{ mr: 1, color: orange[500] }} />
      <Typography variant="h6" sx={{ fontWeight: '600' }}>Répartition par catégorie</Typography>
    </Box>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          fill={orange[500]}
          label={(entry) => entry.name}
        >
          {data.map(( index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={[
                orange[500],
                deepOrange[500],
                orange[300],
                deepOrange[300],
                orange[200],
                deepOrange[200]
              ][index % 6]} 
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number, name: string) => [`${value} produits`, name]}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

const TopProducts = ({ data }: { data: any[] }) => (
  <Card sx={{ 
    p: 3, 
    height: '100%',
    boxShadow: 'none',
    border: `1px solid ${grey[200]}`,
    borderRadius: '12px'
  }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 3,
      color: grey[800]
    }}>
      <Star sx={{ mr: 1, color: orange[500] }} />
      <Typography variant="h6" sx={{ fontWeight: '600' }}>Produits populaires</Typography>
    </Box>
    <Box>
      {data.map((product, index) => (
        <Box key={product.id} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: '500' }}>{product.name}</Typography>
            <Typography variant="body2" sx={{ fontWeight: '500' }}>{product.sales} ventes</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={product.percentage} 
            sx={{ 
              height: 8,
              borderRadius: 4,
              backgroundColor: grey[200],
              '& .MuiLinearProgress-bar': {
                backgroundColor: [
                  orange[500],
                  deepOrange[500],
                  orange[300],
                  deepOrange[300]
                ][index % 4],
                borderRadius: 4
              }
            }} 
          />
        </Box>
      ))}
    </Box>
  </Card>
);

const DeliveryStatus = ({ data }: { data: any[] }) => (
  <Card sx={{ 
    p: 3, 
    height: '100%',
    boxShadow: 'none',
    border: `1px solid ${grey[200]}`,
    borderRadius: '12px'
  }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 3,
      color: grey[800]
    }}>
      <LocalShipping sx={{ mr: 1, color: orange[500] }} />
      <Typography variant="h6" sx={{ fontWeight: '600' }}>Statut des livraisons</Typography>
    </Box>
    <ResponsiveContainer width="100%" height={250}>
      <RadialBarChart
        innerRadius="20%"
        outerRadius="90%"
        data={data}
        startAngle={180}
        endAngle={-180}
      >
        <RadialBar
          label={{ position: 'insideStart', fill: 'white' }}
          background={{ fill: grey[200] }}
          dataKey="value"
        >
          {data.map(( index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={[
                orange[500],
                deepOrange[500],
                orange[300],
                deepOrange[300]
              ][index % 4]} 
            />
          ))}
        </RadialBar>
        <Legend 
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={{
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
        <Tooltip 
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  </Card>
);

interface Props {
  as?: ElementType;
}

const Accueil = ({ as: Component = 'div' }: Props) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('month');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [products, carts, users, categories] = await Promise.all([
          axios.get('https://dummyjson.com/products'),
          axios.get('https://dummyjson.com/carts'),
          axios.get('https://dummyjson.com/users'),
          axios.get('https://dummyjson.com/products/categories')
        ]);

        // Simuler des données de ventes avec tendance selon la période
        const generateSalesData = () => {
          const data = [];
          const days = timeFrame === 'day' ? 1 : timeFrame === 'week' ? 7 : timeFrame === 'month' ? 30 : 365;
          
          for (let i = days; i >= 0; i--) {
            data.push({
              x: format(subDays(new Date(), i), 'yyyy-MM-dd'),
              y: Math.floor(Math.random() * (timeFrame === 'day' ? 1000 : timeFrame === 'week' ? 5000 : timeFrame === 'month' ? 10000 : 50000) + 1000)
            });
          }
          return data;
        };

        interface Category {
            name: string;
            value: number;
        }

        const categoryData: Category[] = categories.data
          .filter((cat: string): cat is string => typeof cat === 'string')
          .slice(0, 5)
          .map((cat: string): Category => ({
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            value: Math.floor(Math.random() * 100) + 20
          }));

        // Simuler des produits populaires
        const topProductsData = products.data.products.slice(0, 5).map((product: any) => ({
          id: product.id,
          name: product.title,
          sales: Math.floor(Math.random() * 1000) + 100,
          percentage: Math.floor(Math.random() * 50) + 50
        }));

        // Simuler des statuts de livraison
        const deliveryStatusData = [
          { name: 'Livré', value: 78 },
          { name: 'En cours', value: 15 },
          { name: 'Retardé', value: 5 },
          { name: 'Annulé', value: 2 }
        ];

        setStats({
          products: products.data.total,
          carts: carts.data.total,
          users: users.data.total,
          categories: categories.data,
          totalSales: timeFrame === 'day' ? 12500 : timeFrame === 'week' ? 87500 : timeFrame === 'month' ? 375000 : 4500000,
          averageOrderValue: timeFrame === 'day' ? 125 : timeFrame === 'week' ? 115 : timeFrame === 'month' ? 105 : 95,
          salesData: generateSalesData(),
          categoryDistribution: categoryData,
          topProducts: topProductsData,
          deliveryStatus: deliveryStatusData,
          customerSatisfaction: Math.floor(Math.random() * 20) + 80 // 80-100%
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeFrame]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: grey[50]
      }}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <CircularProgress 
            size={60} 
            thickness={5}
            sx={{
              color: orange[500],
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }} 
          />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      maxWidth: '1800px', 
      margin: '0 auto',
      backgroundColor: grey[50],
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        mb: 4
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" sx={{ 
            fontWeight: '700',
            color: grey[800],
            mb: 1
          }}>
            Tableau de bord
          </Typography>
          <Typography variant="body1" sx={{ 
            color: grey[600],
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box component="span" sx={{ 
              width: 12, 
              height: 12, 
              backgroundColor: orange[500], 
              display: 'inline-block',
              borderRadius: '50%',
              mr: 1
            }} />
            Résumé des performances et statistiques
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TimeFrameSelector timeFrame={timeFrame} onChange={setTimeFrame} />
        </motion.div>
      </Box>
      
      <Grid container={true} spacing={3} sx={{ mb: 3 }}>
        <Grid component={Component} item={true} xs={12} sm={6} md={4} lg={2} xl={2}>
          <StatCard
            title="Produits"
            value={stats?.products || 0}
            icon={<Inventory sx={{ fontSize: 24, color: orange[500] }} />}
            delay={0}
            trend={5.2}
          />
        </Grid>
        <Grid component={Component} item={true} xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Paniers"
            value={stats?.carts || 0}
            icon={<ShoppingCart sx={{ fontSize: 24, color: orange[500] }} />}
            delay={0.1}
            trend={12.7}
          />
        </Grid>
        <Grid component={Component} item={true} xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Utilisateurs"
            value={stats?.users || 0}
            icon={<People sx={{ fontSize: 24, color: orange[500] }} />}
            delay={0.2}
            trend={8.4}
          />
        </Grid>
        <Grid component={Component} item={true} xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Catégories"
            value={stats?.categories.length || 0}
            icon={<Category sx={{ fontSize: 24, color: orange[500] }} />}
            delay={0.3}
          />
        </Grid>
        <Grid component={Component} item={true} xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Ventes Totales"
            value={`${(stats?.totalSales || 0).toLocaleString()}€`}
            icon={<MonetizationOn sx={{ fontSize: 24, color: orange[500] }} />}
            delay={0.4}
            trend={timeFrame === 'day' ? 2.5 : timeFrame === 'week' ? 7.8 : timeFrame === 'month' ? 15.3 : 22.6}
            subtitle={`Sur ${timeFrame === 'day' ? '24h' : timeFrame === 'week' ? '7 jours' : timeFrame === 'month' ? '30 jours' : '1 an'}`}
          />
        </Grid>
        <Grid component={Component} item={true} xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Satisfaction"
            value={`${stats?.customerSatisfaction || 0}%`}
            icon={<Star sx={{ fontSize: 24, color: orange[500] }} />}
            delay={0.5}
            trend={1.8}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid component={Component} item={true} xs={12} lg={8}>
          <Box sx={{ width: '100%' }}>
            <SalesChart data={stats?.salesData || []} />
          </Box>
        </Grid>
        <Grid component={Component} item={true} xs={12} lg={4}>
          <Box sx={{ width: '100%' }}>
            <CategoryDistribution data={stats?.categoryDistribution || []} />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid component={Component} item={true} xs={12} md={6} lg={4}>
          <TopProducts data={stats?.topProducts || []} />
        </Grid>
        <Grid component={Component} item={true} xs={12} md={6} lg={4}>
          <DeliveryStatus data={stats?.deliveryStatus || []} />
        </Grid>
        <Grid component={Component} item={true} xs={12} md={12} lg={4}>
          <Card sx={{ 
            p: 3, 
            height: '100%',
            boxShadow: 'none',
            border: `1px solid ${grey[200]}`,
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              color: grey[800]
            }}>
              <Equalizer sx={{ mr: 1, color: orange[500] }} />
              <Typography variant="h6" sx={{ fontWeight: '600' }}>Panier moyen</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ 
                fontWeight: '700',
                color: orange[500],
                mb: 1
              }}>
                {stats?.averageOrderValue || 0}€
              </Typography>
              <Typography variant="body1" sx={{ color: grey[600] }}>
                {timeFrame === 'day' ? 'Aujourd\'hui' : timeFrame === 'week' ? 'Cette semaine' : timeFrame === 'month' ? 'Ce mois' : 'Cette année'}
              </Typography>
              <Box sx={{ 
                mt: 3,
                p: 2,
                backgroundColor: orange[50],
                borderRadius: '12px',
                display: 'inline-block'
              }}>
                <TrendingUp sx={{ 
                  fontSize: 40, 
                  color: orange[500],
                  opacity: 0.8
                }} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Accueil;