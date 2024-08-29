'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'

export default function Home() {
  const [listOfLearn, setListOfLearn] = useState([]);
  const [learn, setLearn] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message }
    ])

    let finalContent = message;
    if (listOfLearn.length > 0) {
      finalContent +=  " Here is some extra information: ";
      for (let i = 0; i < listOfLearn.length; i++) {
        if (i === listOfLearn.length - 1) finalContent += listOfLearn[i] + ".";
        else finalContent += listOfLearn[i] + ", ";
      }
      //finalContent += " You can completely ignore these extra informations if the question is not related to these, and answer like usual."
    }
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.1-8b-instruct:free",
          "messages": [
            { "role": "user", "content": finalContent },
          ],
        })
      });
      const data = await res.json();
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: data.choices[0]?.message.content },
      ])
      console.log("success");
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    console.log(finalContent);
  }

  const messagesEndRef = useRef(null)



  const sendLearnInfo = () => {
    setListOfLearn((prevLearn) => [
      ...prevLearn,
      learn
    ]);
    setLearn('');
  };

  return (
    <Box
      width="100vw"
      height="200vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: 'linear-gradient(135deg, #ADD8E6, #87CEFA, #FFB6C1, #FFD700)', // Gradient background
        backgroundSize: '200% 200%', // Allows for animation to flow across the background
        animation: 'backgroundAnimation 10s ease infinite', // Animation for the background
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
        borderRadius: 2, // Rounded corners for a modern look
        p: 2, // Padding around the box content
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover effects
        '&:hover': {
          transform: 'scale(1.02)', // Slight scale up on hover
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)', // Enhanced shadow on hover
        },
        '@keyframes backgroundAnimation': { // Keyframes for background animation
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      }}
    >
      <Typography
        variant="h2"
        textAlign="center"
        fontWeight="bold"
        sx={{
          fontSize: '2.5rem', // Font size for the text
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', // Subtle text shadow
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Font family for the text
          p: 1, // Padding around the text
          background: 'linear-gradient(135deg, #ADD8E6, #87CEFA, #FFB6C1, #FFD700)', // Gradient background with multiple colors
          backgroundSize: '200% 200%', // Ensures the gradient is large enough to animate
          WebkitBackgroundClip: 'text', // Clip the gradient to the text
          WebkitTextFillColor: 'transparent', // Transparent text to show gradient
          animation: 'gradientAnimation 5s ease infinite', // Animation settings
          '@keyframes gradientAnimation': { // Inline keyframes definition
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
        }}
      >
        AI Customer Support
      </Typography>
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
        sx={{
          border: '1px solid transparent', // Transparent border for initial state
          background: 'linear-gradient(to bottom right, #ffffff, #f0f0f0)', // Subtle background gradient
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
          position: 'relative', // Relative positioning for pseudo-elements
          overflow: 'hidden', // Ensures content does not overflow
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(135deg, #ADD8E6, #87CEFA, #FFB6C1)', // Gradient for animated border effect
            zIndex: 1,
            transition: 'all 0.5s ease',
          },
          '&:hover::before': {
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '16px',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'white', // Background color of the chat frame
            zIndex: 2,
            borderRadius: '16px', // Inner content border radius
          },
          '& > *': {
            position: 'relative', // Ensure the content is above the pseudo-elements
            zIndex: 3, // Place content above pseudo-elements
          },
          transition: 'box-shadow 0.3s ease', // Smooth transition for shadow effect
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)', // Enhanced shadow on hover
          },
        }}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{
            backgroundColor: '#f7f7f7', // Subtle background to make messages pop
            padding: 2, // Internal padding for better spacing
            borderRadius: 2, // Slightly rounded corners for a softer look
            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.05)', // Inner shadow for depth
            position: 'relative', // Relative positioning for pseudo-elements
            '&::-webkit-scrollbar': { // Custom scrollbar for webkit browsers
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': { // Scrollbar thumb styling
              backgroundColor: '#ccc',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': { // Hover effect for scrollbar thumb
              backgroundColor: '#aaa',
            },
            '& > *': {
              transition: 'transform 0.2s ease-in-out', // Smooth transition for hover effects
              '&:hover': {
                transform: 'scale(1.01)', // Slightly scale up on hover
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '30px',
              background: 'linear-gradient(to bottom, rgba(247, 247, 247, 1), rgba(247, 247, 247, 0))', // Gradient fade at the top
              pointerEvents: 'none', // Ensures it doesn’t block interactions
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30px',
              background: 'linear-gradient(to top, rgba(247, 247, 247, 1), rgba(247, 247, 247, 0))', // Gradient fade at the bottom
              pointerEvents: 'none', // Ensures it doesn’t block interactions
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined" // Outlined variant for modern look
            InputProps={{
              sx: {
                backgroundColor: '#fff', // Background color for the input
                borderRadius: '8px', // Rounded corners for modern look
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                '&.Mui-focused': { // Focus state styling
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)', // Enhanced shadow on focus
                },
                '&:hover': { // Hover state styling
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Slightly larger shadow on hover
                },
                transition: 'box-shadow 0.3s ease, background-color 0.3s ease', // Smooth transitions
              },
            }}
            InputLabelProps={{
              sx: {
                color: '#888', // Label color
                '&.Mui-focused': { // Focused state styling for label
                  color: '#555', // Darker color on focus
                },
                transition: 'color 0.3s ease', // Smooth transition for label color
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ddd', // Border color for outlined input
                },
                '&:hover fieldset': {
                  borderColor: '#bbb', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#888', // Border color on focus
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FFD93D 90%)', // Gradient background for a modern look
              color: '#fff', // Text color
              borderRadius: '8px', // Rounded corners
              padding: '8px 16px', // Padding for a larger button
              textTransform: 'none', // Keep text case normal
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
              transition: 'all 0.3s ease', // Smooth transition for all properties
              position: 'relative', // Set position for pseudo-elements
              overflow: 'hidden', // Prevent overflow for animated effect
              '&:hover': {
                background: 'linear-gradient(45deg, #FFD93D 30%, #FF6B6B 90%)', // Reverse gradient on hover
                boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)', // Increase shadow on hover
                transform: 'translateY(-2px)', // Slight lift effect on hover
                '&::before': {
                  width: '300%', // Increase width for the superstar effect
                  height: '300%', // Increase height for the superstar effect
                  opacity: 0.2, // Set opacity for the superstar effect
                },
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 10%, transparent 10%)',
                backgroundSize: '10px 10px',
                animation: 'superstar 1s linear infinite',
                zIndex: 0,
                transition: 'width 0.5s, height 0.5s, opacity 0.5s',
              },
              '@keyframes superstar': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          background: 'linear-gradient(135deg, #ADD8E6 0%, #87CEFA 100%)', // Gradient background for the header
        }}
      >





        <Typography variant={'h2'} color={'#333'} textAlign={'center'} fontWeight="bold">
          Extra information
        </Typography>
      </Box>
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {listOfLearn.map((learn, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="flex-start"
            >
              <Box
                bgcolor="primary.main"
                color="white"
                borderRadius={16}
                p={3}
              >
                {learn}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={learn}
            onChange={(e) => setLearn(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={sendLearnInfo}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FFD93D 90%)', // Gradient background for a modern look
              color: '#fff', // Text color
              borderRadius: '8px', // Rounded corners
              padding: '8px 16px', // Padding for a larger button
              textTransform: 'none', // Keep text case normal
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
              transition: 'all 0.3s ease', // Smooth transition for all properties
              position: 'relative', // Set position for pseudo-elements
              overflow: 'hidden', // Prevent overflow for animated effect
              '&:hover': {
                background: 'linear-gradient(45deg, #FFD93D 30%, #FF6B6B 90%)', // Reverse gradient on hover
                boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)', // Increase shadow on hover
                transform: 'translateY(-2px)', // Slight lift effect on hover
                '&::before': {
                  width: '300%', // Increase width for the superstar effect
                  height: '300%', // Increase height for the superstar effect
                  opacity: 0.2, // Set opacity for the superstar effect
                },
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 10%, transparent 10%)',
                backgroundSize: '10px 10px',
                animation: 'superstar 1s linear infinite',
                zIndex: 0,
                transition: 'width 0.5s, height 0.5s, opacity 0.5s',
              },
              '@keyframes superstar': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}