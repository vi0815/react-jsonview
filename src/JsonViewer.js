import React from 'react';
import './style.css';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from "@mui/material"
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import {
  Delete,
  AddCircleOutlineIcon,
  KeyboardArrowUpRounded,
  KeyboardArrowDownRounded,
} from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Autocomplete from '@mui/material/Autocomplete';

export default function JsonViewer(props) {
  const [data, setData] = React.useState(props.data);
  const [newField, setNewField] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [moved, setMoved] = React.useState(" ");

  function handleDeleteButton(deleteKey) {
    let newHash = {};
    Object.keys(data).map((key) => {
      if (key != deleteKey) {
        newHash[key] = data[key];
      }
    });
    setData(newHash);
  }

  function moveItem(direction, pivotKey) {
    let position;
    let keyValue;
    Object.keys(data).map((key, index) => {
      if (key === pivotKey) {
        position = index;
        keyValue = data[key];
      }
    });

    let newPosition = direction === 'up' ? position - 1 : position + 1;
    let newResult = {};
    let newIndex = 0;
    console.log('Oldposition: ' + position + ' newposition: ' + newPosition);
    Object.keys(data).map((key, index) => {
      if (newIndex === newPosition) {
        // insert moved value here
        newResult[pivotKey] = keyValue;
        newIndex += 1;
        console.log('replaced at position: ' + newIndex);
      }
      if (index !== position) {
        newResult[key] = data[key];
        newIndex += 1;
      }
      if (newIndex === newPosition) {
        // insert moved value here
        newResult[pivotKey] = keyValue;
        newIndex += 1;
        console.log('replaced at position: ' + newIndex);
      }
    });
    console.log(newResult);
    setData(newResult);
    if (moved === " ") {
      setMoved("")
    } else {
        setMoved(" ")
      }
    
  }

  function changeData(event) {
    const id = event.target.id
    // has the value changed?
    if (data[id] !== event.target.value) {
      let newData = {...data}
      newData[id] = event.target.value
      setData(newData)
    }
  }

  function generateObjectFieldTextFields() {
    return Object.keys(data).map((key, index) => {
      return (
        <TextField
          id={key}
          key={key}
          label={key}
          variant="standard"
          defaultValue={data[key]}
          onBlur={changeData}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                      m: 0,
                      mt: 0.5,
                      width: 5,
                      height: 5,
                    },
                  }}
                >
                  <IconButton
                    aria-label="move upwards"
                    size="small"
                    disabled={index === 0 ? true : false}
                    onClick={() => {
                      moveItem('up', key);
                    }}
                  >
                    <KeyboardArrowUpRounded fontSize="tiny" />
                  </IconButton>

                  <IconButton
                    aria-label="move downwards"
                    size="small"
                    disabled={
                      index === Object.keys(data).length - 1 ? true : false
                    }
                    onClick={() => {
                      moveItem('down', key);
                    }}
                  >
                    <KeyboardArrowDownRounded fontSize="tiny" />
                  </IconButton>
                </Box>

                <IconButton
                  aria-label="delete item"
                  size="small"
                  onClick={() => handleDeleteButton(key)}
                >
                  <Delete fontSize="tiny" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      );
    });
  }

  function clickAddItem(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeAddItem() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);

  function generateTitleLine() {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Typography variant="h6" component="h6">{props.title}</Typography>

        <IconButton aria-label="Add entry" size="small" onClick={clickAddItem}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  function addField() {
    let newResult = { ...data };
    newResult[newField] = '';
    setData(newResult);
    setNewField("")
  }

  function getPopOver() {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={closeAddItem}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 0, height: '50ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="combo-box-demo"
            sx={{ width: '25ch' }}
            onChange={(event) => setNewField(event.target.value)}
            value={newField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="delete item"
                    size="small"
                    onClick={() => addField()}
                  >
                    <AddIcon fontSize="tiny" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Popover>
    );
  }

  return (
    <div>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 0, width: '50ch' },
        }}
        noValidate
        autoComplete="off"
      >
        {generateTitleLine()}
        {getPopOver()}

        {generateObjectFieldTextFields()}
        {moved}
      </Box>
    </div>
  );
}

const fieldNames = [
  { label: 'addressLine1' },
  { label: 'addressLine2' },
  { label: 'city' },
  { label: 'postcode' },
  { label: 'country' },
];
