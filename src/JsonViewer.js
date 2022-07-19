import React from 'react';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';

import ListItem from '@mui/material/ListItem';


import {
  Delete,
  KeyboardArrowUpRounded,
  KeyboardArrowDownRounded,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

JsonViewer.propTypes = {
  /*
  Start object that should be displayed. Can be an useState that is used with on onChange as well
   */
  data: PropTypes.object.isRequired,
  /*
  Title that is displayed on top as a typography object
   */
  title: PropTypes.string.isRequired,
  /*
  Function that is called to receive the changes. The return argument is an ordered object
  */
  onChange: PropTypes.func.isRequired,
};

function convertOuterObjectToInternal(data) {
  let fieldNameStatus = []
  Object.keys(data).map((fieldName) => {
    const newFieldObject = {
      label: fieldName,
      value: data[fieldName],
      checked: true,
      wasPreset: false
    }
    fieldNameStatus.push(newFieldObject)
  })
  return fieldNameStatus
}


export default function JsonViewer(props) {
  const [mapState, dispatch] = React.useReducer(reducer, convertOuterObjectToInternal(props.data));
  const [anchorEl, setAnchorEl] = React.useState(null);

  function reducer(state, action) {
    let newState
    if (action.type === "change") {
      newState = changeFieldValue(state, action.id, action.value)
    } else {
      
    }
    return newState
  }

  function changeFieldValue(state, idString, value) {
    const id = parseInt(idString)
    let result = []
    for (let i=0; i<state.length; i++) {
      if (i == id) {
        let newObject = {...state[i]}
        newObject.value = value
        result.push(newObject)
      } else {
        result.push({...state[i]})
      }
    }
    return result
  }

  function findFirstChecked() {
    for (let i=0; i<1; i++) {
      if (mapState[i].checked) {
        return i
      }
    }
    return -1
  }
  
  function findLastChecked() {
    for (let i=(mapState.length-1); i>=0; i--) {
      if (mapState[i].checked) {
        return i
      }
    }
    return -1
  }


  function sendData() {
    let result = {}
    mapState.forEach((record) => {
      if (record.checked === true) {
        result[record.label] = record.value
      }
    })
    props.onChange({ result });
  }

  React.useEffect(() => {
    sendData();
  }, [mapState]);

  function moveItem(direction, pivotKey) {
    let position;
    let keyValue;
    Object.keys(mapStatus).map((key, index) => {
      if (key === pivotKey) {
        position = index;
        keyValue = mapStatus[key];
      }
    });

    let newPosition = direction === 'up' ? position - 1 : position + 1;
    let newResult = {};
    let newIndex = 0;
    Object.keys(mapStatus).map((key, index) => {
      if (newIndex === newPosition) {
        // insert moved value here
        newResult[pivotKey] = keyValue;
        newIndex += 1;
        console.log('replaced at position: ' + newIndex);
      }
      if (index !== position) {
        newResult[key] = mapStatus[key];
        newIndex += 1;
      }
      if (newIndex === newPosition) {
        // insert moved value here
        newResult[pivotKey] = keyValue;
        newIndex += 1;
        console.log('replaced at position: ' + newIndex);
      }
    });

    setMapStatus(newResult);
    if (moved === ' ') {
      setMoved('');
    } else {
      setMoved(' ');
    }
  }

  function renderFieldNameItem(id, label, value, first, last) {
    return (
      <TextField
        id={String(id)}
        key={label}
        variant="standard"
        defaultValue={value}
        label={label}
        onBlur={(event) => dispatch({
          type: "change",
          id: event.target.id,
          value: event.target.value
        })}
        fullWidth
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
                  disabled={id === first}
                  onClick={() => {
                    moveItem('up', index);
                  }}
                >
                  <KeyboardArrowUpRounded fontSize="tiny" />
                </IconButton>

                <IconButton
                  aria-label="move downwards"
                  size="small"
                  disabled={id === last}
                  onClick={() => {} }
                >
                  <KeyboardArrowDownRounded fontSize="tiny" />
                </IconButton>
              </Box>

              <IconButton
                aria-label="delete item"
                size="small"
                onClick={() => handleDeleteButton(index)}
              >
                <Delete fontSize="tiny" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    )
  }

  function generateFieldNameView() {
    // find first and last checked elements for the up/down arrows
    const first = findFirstChecked()
    const last = findLastChecked()

    return (
      mapState.map((record, index) => {
        return renderFieldNameItem(index, record.label, record.value, first, last)
    })
  
    )
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
        <Typography variant="h7" component="h7">
          {props.title}
        </Typography>

        <IconButton aria-label="Add entry" size="small" onClick={clickAddItem}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  function addField() {
    let newResult = { ...mapStatus };
    newResult[newField] = '';
    setMapStatus(newResult);
    setNewField('');
  }

  function keyPress(e) {
    if (e.code === 'Enter') {
      e.preventDefault();
      addField();
    }
  }

  /* generateCheckList creates a list for all active field names, marked removed field names and preset field names that are
  neither in removed or activate field list */
  function generateCheckList() {
    let lists = {
      active: {},
      inactive: {},
      preset: {}
    }
    // collect active elements
    Object.keys(mapStatus).map((key) => {
      lists.active[key] = true
    })

    // collect inactive elements
    Object.keys(inactive).map((key) => {
      lists.inactive[key] = false
    })

    // collect preset, but remove elements that are already in active or inactive list
    fieldNames.forEach((element) => {
      if (!Object.keys(lists.active).includes(element.label) && !Object.keys(lists.inactive).includes(element.label)) {
        lists.preset[element.label] = false
      }
    })
    return lists
  }



  function renderItem(label, checked) {
    return (
    <ListItem key={label}>
      <ListItemText id={label} primary={label} />
      <Checkbox
                  edge="end"
                  checked={checked}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': label }}
      />
    </ListItem>
      )
  } 

  function generateCheckListItems() {
    let lists = generateCheckList()
    return (
      <List dense={true}>
        {Object.keys(lists.active).map((label) => {
          return (renderItem(label, lists.active[label]))
        })}
        {Object.keys(lists.preset).map((label) => {
          return (renderItem(label, lists.preset[label]))
        })}
      </List>
    )
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
            '& > :not(style)': { m: 0, height: "50ch" },
          }}
          noValidate
          autoComplete="off"
        >
        {generateCheckListItems()}
        </Box>
      </Popover>
    );
  }

  return (
    <div>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 0 },
        }}
        noValidate
        autoComplete="off"
      >
        {//generateTitleLine()
        }
        {//getPopOver()
        }

        {generateFieldNameView()}
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
