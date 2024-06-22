import React, { useState, useEffect } from 'react';
import { Box, Typography,Tooltip, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState
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
    const fontSize = isMobile ? 14 : 20;
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
        if(!['expense','outstanding','externalLab'].includes(type)){
            colorArr = [redColor, yellowColor, greenColor]
        }
        return { color: percentage <= 35 ? colorArr[0] : percentage <= 70 ? colorArr[1] : colorArr[2] , percentage}
    }
    const getCard = (obj)=>{
        const { name, previous, current, type, desc } = obj;
        const { color, percentage } = getGaugeObj(current, previous, type);
        const isCurrencySymbolNeeded = type != 'patient'
        return (
            <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color:'white' }}>
            <Box
              sx={{
                padding: '20px',
                borderRadius: '20px',
                boxShadow: '3px 3px 3px 3px',
                border: '5px solid white',
                height: isMobile ? 200 : 400,
                width: isMobile ? 200 : 400,
              }}
            >
              <Typography sx={{fontWeight:'bold', fontSize, lineHeight:1}}  variant="overline" display="block">{name}</Typography>
              {desc ? <Typography variant="body2" sx={{ fontSize: fontSize - 6 }}>{desc}</Typography> : null}
             <GaugeContainer
                width={isMobile ? 200 : 400}
                height={isMobile ? 100 : 300}
                startAngle={-110}
                endAngle={110}
                value={percentage}
                cornerRadius="25%"
                >
                    <GaugeReferenceArc sx={{ fill: 'rgb(234 238 255 / 17%)'}}/>
                    <GaugeValueArc sx={{fill:color}}/>
                    <GaugePointer/>
                </GaugeContainer>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography
                    sx={{ fontWeight: 'bold', width:'100vw',fontSize, textAlign:'center'}}
                    variant="overline"
                    display="block"
                    gutterBottom
                    >
                    {`${isCurrencySymbolNeeded ? '₹ ' : ''}${current.toLocaleString('en-IN')} / ${previous.toLocaleString('en-IN')}`}
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
        patientCount,
        externalLabAmount
    } = getDatasByProfit(dataIds, data, typeFilter, timeFilter)
    let {
        totalIncome: previousTotalIncome, 
        totalExpense: previousTotalExpense,
        totalOutstanding : previousTotalOutstanding,
        totalDiscount: previousTotalDiscount,
        patientCount: previousPatientCount,
        externalLabAmount: prevExternalLabAmount
    } = getDatasByProfit(previousDataIds, data, typeFilter, timeFilter);
    const previousProfit = previousTotalIncome - previousTotalDiscount - previousTotalExpense
    const profit = totalIncome - totalDiscount - totalExpense
    const cards = [
        getCard({name: 'Profit Panel', type: 'profit', previous: previousProfit, current: profit, desc:"(Paid Amount - Expense - Discount)"}),
        getCard({name: 'Income Panel', type: 'income', previous: previousTotalIncome, current: totalIncome, desc:'(Paid Amount)'}),
        getCard({name: 'Expense Panel', type: 'expense', previous: previousTotalExpense, current: totalExpense}),
        getCard({name: 'External Lab Expense', type: 'externalLab', previous: prevExternalLabAmount, current: externalLabAmount}),
        getCard({name: 'Outstanding Panel', type: 'outstanding', previous: previousTotalOutstanding, current: totalOutstanding}),
        getCard({name: 'Discount Panel', type: 'discount', previous: previousTotalDiscount, current: totalDiscount}),
        getCard({name: 'Patient Panel', type: 'patient', previous: previousPatientCount, current: patientCount}),
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