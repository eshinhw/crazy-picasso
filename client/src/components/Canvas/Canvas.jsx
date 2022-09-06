import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import "./Canvas.css";

function Canvas({ socketRef, paintData, currentDrawerUsername, isCurrentDrawer, word }) {

    useEffect(() => {
        const handleLiveDrawing = () => {
            const canvas = document.querySelector('#board');
            const ctx = canvas.getContext('2d');

            socketRef.current.on('live_drawing', handleLiveDrawing);

            function handleLiveDrawing(socketData) {
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.lineWidth = socketData.paintData.lineWidth;
                ctx.strokeStyle = socketData.paintData.strokeStyle;
                ctx.beginPath();
                ctx.moveTo(socketData.mouseData.previousX, socketData.mouseData.previousY);
                ctx.lineTo(socketData.mouseData.x, socketData.mouseData.y);
                ctx.closePath();
                ctx.stroke();
            }
        };

        handleLiveDrawing();
    }, [])

    useEffect(() => {
        const canvas = document.querySelector('#board');
        const ctx = canvas.getContext('2d');

        const mouseData = { x: 0, y: 0, previousX: 0, previousY: 0 };
        // const paintData = { lineWidth: 5, strokeStyle: 'green' };
        const socketData = { mouseData, paintData };

        const handleCanvasMouseXY = (e) => {
            mouseData.previousX = mouseData.x;
            mouseData.previousY = mouseData.y;

            mouseData.x = e.pageX - canvas.offsetLeft;
            mouseData.y = e.pageY - canvas.offsetTop + 20;
        }

        const handleUserDraw = () => {
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = paintData.lineWidth;
            ctx.strokeStyle = paintData.strokeStyle;
            ctx.beginPath();
            ctx.moveTo(mouseData.previousX, mouseData.previousY);
            ctx.lineTo(mouseData.x, mouseData.y);
            ctx.closePath();
            ctx.stroke();

            socketRef.current.emit("drawing", { socketData });
        };

        const addUserDrawListener = () => {
            canvas.addEventListener('mousemove', handleUserDraw);
        }

        if (word != "" && isCurrentDrawer()) {
            canvas.addEventListener('mousemove', handleCanvasMouseXY);
    
            canvas.addEventListener('mousedown', addUserDrawListener);
    
            canvas.addEventListener('mouseup', function () {
                canvas.removeEventListener('mousemove', handleUserDraw);
            });
        } 

        else {
            return;            
        }

        return () => {
            canvas.removeEventListener('mousedown', addUserDrawListener);
            canvas.removeEventListener('mousemove', handleCanvasMouseXY);
            canvas.removeEventListener('mousemove', handleUserDraw);
        }

    }, [paintData, currentDrawerUsername, word]);

    return (
        <Container>
            <Paper elevation={5}>
                <canvas className='board' id='board' width={800} height={600} />
            </Paper>
        </Container>
    );
};

export default Canvas;
