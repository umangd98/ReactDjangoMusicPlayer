import React from 'react';
import { Grid, Button, Typography, IconButton } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
const pages = {
  JOIN: 'pages.join',
  CREATE: 'pages.create',
};
function joinInfo() {
  return 'join page';
}
function createInfo() {
  return 'Create Page';
}
const Info = (props) => {
  const [page, setPage] = useState(pages.JOIN);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" vairant="h4">
          What is House Party?
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="body1">
          {page === pages.JOIN ? joinInfo() : createInfo()} Hi
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" vairant="contained" component={Link} to="/">
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default Info;
