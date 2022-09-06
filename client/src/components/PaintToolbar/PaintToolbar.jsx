import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import colors from '../../constants/Colors'

function PaintToolBar({ setPaintData }) {
    const colorSecondRowIndex = Math.floor(colors.length / 2);

    function Palette() {
        const handleSelectColor = (color) => {
            setPaintData({ lineWidth: 5, strokeStyle: color });
        };

        return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex" }}>
                    {colors.slice(0, colorSecondRowIndex).map(function (color, i) {
                        return <Box style={{ width: "24px", height: "24px", border: "1px solid black", backgroundColor: color }} key={i}
                            onClick={() => {handleSelectColor(color)}}
                        ></Box>
                    })}
                </Box>

                <Box sx={{ display: "flex" }}>
                    {colors.slice(colorSecondRowIndex, colors.length).map(function (color, i) {
                        return <Box style={{ width: "24px", height: "24px", border: "1px solid black", backgroundColor: color }} key={i}
                            onClick={() => {handleSelectColor(color)}}></Box>
                    })}
                </Box>
            </Box>
        )
    }

    return (
        <Container sx={{ display: "flex" }}>
            <Palette />
        </Container>
    );
};

export default PaintToolBar;
