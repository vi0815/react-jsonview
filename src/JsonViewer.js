import React from 'react';
import './style.css';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';



export default function JsonViewer(props) {
  const [data, setData] = React.useState(props.data);

  function handleDeleteButton(key) {
    console.log(key)
  }

  return (
    <div>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        {Object.keys(data).map((key, index) => {
          return (
            <TextField
              id={String(index)}
              label={key}
              variant="standard"
              defaultValue={data[key]}
              endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(event) => handleDeleteButton(event.key)}
                      edge="end"
                    ></IconButton>
                  </InputAdornment>
                }
            />
          );
        })}
      </Box>
    </div>
  );
}
