import React, { useState, useEffect } from 'react';
import { Box, Typography,Tooltip, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState,
    gaugeClasses
  } from '@mui/x-charts/Gauge';
import { getDatasByProfit, getTimeFilter } from '../utils/utils';
  function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  
    if (valueAngle === null) {
      // No value to display
      return null;
    }
  
    const target = {
      x: cx + outerRadius * Math.sin(valueAngle),
      y: cy - outerRadius * Math.cos(valueAngle),
    };
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill="red" />
        <path
          d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
          stroke="red"
          strokeWidth={3}
        />
      </g>
    );
  }
const AdminDashBoard=({
    allDataIds,
    data,
    filterObj
})=>{
    const isMobile = useMediaQuery('(max-width: 600px)');
   const [numCardsPerRow, setNumCardsPerRow] = useState(isMobile ? 1 : 2)
    const theme = useTheme();
    const calculateCardsPerRow = (containerWidth, cardWidth) => {
        const spacing = theme.spacing(2); 
        const availableWidth = containerWidth - spacing * 2; 
        return Math.floor(availableWidth / (cardWidth + spacing)); 
      };
    const getGaugeObj = (current, previous, type)=>{
        let percentage = ((current/previous)*100)*(70/100)
        percentage = percentage > 100 ? 100 : percentage;
        const greenColor = '#47c643'
        const yellowColor = '#c6af43'
        const redColor = '#c64367'
        let colorArr = [greenColor, yellowColor, redColor];
        if(type != 'expense'){
            colorArr = [redColor, yellowColor, greenColor]
        }
        return { color: percentage <= 35 ? colorArr[0] : percentage <= 70 ? colorArr[1] : colorArr[2] , percentage}
    }
    const getCard = (obj)=>{
        const { name, previous, current, type } = obj;
        const { color, percentage } = getGaugeObj(current, previous, type)
        return (
            <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
              sx={{
                padding: '20px',
                borderRadius: '20px',
                boxShadow: '5px 5px 5px 5px',
                border: '5px solid white',
                height: 400,
                width: 400,
              }}
            >
            <Typography sx={{fontWeight:'bold', fontSize:20}}  variant="overline" display="block" gutterBottom>{name}</Typography>
             <GaugeContainer
                width={400}
                height={300}
                startAngle={-110}
                endAngle={110}
                value={percentage}
                cornerRadius="25%"
                sx={(theme) => ({
                    [`& .css-b9rdri-MuiGauge-referenceArc`]: {
                    fill: color,
                    }
                })}
                >
                    <GaugeReferenceArc/>
                    <GaugeValueArc/>
                    <GaugePointer />
                </GaugeContainer>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography
                        sx={{ fontWeight: 'bold', width:'100vw',fontSize: 20, textAlign:'center'}}
                        variant="overline"
                        display="block"
                        gutterBottom
                        >
                        {`${current} / ${previous}`}
                        </Typography>
                </Box>
            </Box>
          </Box>
        )
    }
    const containerRef = React.createRef();
    const { timeFilter, timeInput, typeFilter } = filterObj
    const dataIds = getTimeFilter(allDataIds, timeFilter, timeInput);
    const previousDataIds = getTimeFilter(allDataIds, timeFilter, timeInput, true);
    let {
        totalIncome, 
        totalExpense,
        totalOutstanding,
        totalDiscount,
    } = getDatasByProfit(dataIds, data, typeFilter, timeFilter)
    let {
        totalIncome: previousTotalIncome, 
        totalExpense: previousTotalExpense,
        totalOutstanding : previousTotalOutstanding,
        totalDiscount: previousTotalDiscount,
    } = getDatasByProfit(previousDataIds, data, typeFilter, timeFilter);
    const previousProfit = previousTotalIncome - previousTotalDiscount - previousTotalExpense
    const profit = totalIncome - totalDiscount - totalExpense
    const cards = [
        getCard({name: 'Profit Panel', type: 'profit', previous: previousProfit, current: profit}),
        getCard({name: 'Income Panel', type: 'income', previous: previousTotalIncome, current: totalIncome}),
        getCard({name: 'Expense Panel', type: 'expense', previous: previousTotalExpense, current: totalExpense}),
        getCard({name: 'Outstanding Panel', type: 'outstanding', previous: previousTotalOutstanding, current: totalOutstanding}),
        getCard({name: 'Discount Panel', type: 'discount', previous: previousTotalDiscount, current: totalDiscount}),
        getCard({name: 'Patient Panel', type: 'patient', previous: previousDataIds.length, current: dataIds.length}),
    ];
    useEffect(() => {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 400;
        setNumCardsPerRow(calculateCardsPerRow(containerWidth, cardWidth));
      }, []);
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap',  height: 'calc(100vh - 100px)', overflowY: 'auto'}} ref={containerRef} >
        <Grid container spacing={2}> 
            {cards.map((card, index) => (
            <Grid item key={index} xs={12 / numCardsPerRow}> 
                {card}
            </Grid>
            ))}
        </Grid>
        </Box>
    )
}

export default AdminDashBoard;