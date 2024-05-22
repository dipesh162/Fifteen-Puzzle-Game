import React, { useEffect, useState } from 'react'
import Box from './Box/Box'
import '../App.css'

function Grid() {

    // Shuffling the tiles
    const shuffle = ()=> {
        return new Array(16)
                    .fill()
                    .map((_,i)=> i+1)
                    .sort(()=> Math.random() - 0.5)
                    .map((num,i)=> ({value:num,index: i}))
    }

    const [numbers,setNumbers] = useState(shuffle())
    const [keyPressed, setKeyPressed] = useState(null);
    const [moves, setMoves] = useState(0)
    const [time, setTime] = useState(0); // Timer state in seconds

    // Function to format time in minutes:seconds
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleShuffle = ()=> setNumbers(shuffle())

    // Setting up keyDown Event
    useEffect(() => {   
        const timer = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
          }, 1000);
      
        const handleKeyDown = (e) => {
            setKeyPressed(e.keyCode);
          };
        // Add event listener when component mounts
        document.addEventListener('keydown', handleKeyDown);
        
        // Remove event listener when component unmounts
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          clearInterval(timer);
        };
    }, []);


    // Trigger event when up,down,left,right key is pressed
    useEffect(() => {
        if (keyPressed !== null) {
          setNumbers((prevNumbers) => {
            const emptyIndex = prevNumbers.findIndex((n) => n.value === 16);

            switch (keyPressed) {
              case 37: // Left arrow key
                if (emptyIndex % 4 !== 3) {
                  handleClick(prevNumbers.find((n) => n.index === emptyIndex + 1))

                  console.log('Arrow Left key pressed');
                }
                break;
              case 38: // Up arrow key
                if (emptyIndex <= 11) {
                  handleClick(prevNumbers.find((n) => n.index === emptyIndex + 4))

                  console.log('Arrow Up key pressed');
                }
                break;
              case 39: // Right arrow key
                if (emptyIndex % 4 !== 0) {
                  handleClick(prevNumbers.find((n) => n.index === emptyIndex - 1))

                  console.log('Arrow Right key pressed');
                }
                break;
              case 40: // Down arrow key
                if (emptyIndex >= 4) {
                  handleClick(prevNumbers.find((n) => n.index === emptyIndex - 4))

                  console.log('Arrow Down key pressed');
                }
                break;
              default:
                console.log(`Key ${keyPressed} pressed`);
            }
    
            return prevNumbers;
          });
    
          setKeyPressed(null); // Reset keyPressed after handling
        }
    }, [keyPressed]);


    // Move tiles on click
    const handleClick = (clickedNum)=>{
        console.log(clickedNum)
        const emptyIndex = numbers.findIndex(num => num.value === 16); // Use findIndex instead of find

        // If the empty index is not found, return early
        if (emptyIndex === -1) return;
      
        // Check if the clicked item is an immediate neighbor of the empty item
        const isImmediateNeighbor = Math.abs(clickedNum.index - emptyIndex) === 1 || Math.abs(clickedNum.index - emptyIndex) === 4;
      
        if (isImmediateNeighbor) {
            const newNumbers = numbers.map((number) => {
                if (number.index === clickedNum.index) {
                // Swap value and index of the clicked item with the item that has value 16
                return { value: 16, index: number.index };
                } else if (number.index === emptyIndex) {
                return { value: clickedNum.value, index: number.index };
                } else {
                // Keep the indices of other items unchanged
                return number;
                }
            });
      
          setNumbers(newNumbers);
          setMoves(moves+1)
        }
    }

    // Proceed 1 step on clicking help button
    const handleHelp = ()=>{
        const findFirst16thTileSibling = numbers.find((num,i)=> numbers[num.index+1]?.value === 16 || numbers[num.index-1]?.value === 16 || numbers[num.index+4]?.value === 16 ||  numbers[num.index-4]?.value === 16)
        handleClick(findFirst16thTileSibling)
    }


    // Reset moves and timer
    const handleReset = ()=>{
        handleShuffle()
        setMoves(0)
        setTime(0)
    }

    return (
        <>
            <div style={{display:'flex'}}>
                <div className='main'>
                    <div className='timer'>Moves <br/>{moves}</div>
                    <div className='timer'>Time <br/> {formatTime(time)}</div>
                    <div className='btn' onClick={handleReset}>Reset</div>
                </div>
                <h1 className='heading'>Fifteen puzzle game</h1>
            </div>
            <button className='btn timer' onClick={handleShuffle}>Shuffle</button>
            <button className='btn timer' onClick={handleHelp}>Help Me!</button>

            <div className='grid'>
                {numbers.map((num, i)=>(
                    <Box key={i} num={num} handleClick={handleClick} />
                ))}
            </div>

            <h2 className='instructions'>INSTRUCTIONS</h2>
            Move tiles in grid to order them from 1 to 15. To move a tile you can click on it or use your arrow keys. Press ESC to pause game.
        </>
    )
}

export default Grid