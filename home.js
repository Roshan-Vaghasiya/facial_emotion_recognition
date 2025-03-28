import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import { DropzoneArea } from 'material-ui-dropzone';
import Clear from '@material-ui/icons/Clear';
import axios from "axios";
import cblogo from "./cblogo.PNG";
import image from "./logo.png";

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: '#2196F3',
    fontSize: "20px",
    fontWeight: 900,
  },
  root: { maxWidth: 345, flexGrow: 1 },
  media: { height: 400 },
  gridContainer: { justifyContent: "center", padding: "4em 1em 0 1em" },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "93vh",
    marginTop: "8px",
    
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 500,
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  tableCell: {
    fontSize: '22px',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  detail: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: {
    background: '#2196F3',
    boxShadow: 'none',
    color: 'white'
  },
  loader: { color: '#be6a77 !important' }
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
      setIsloading(false);
    }
  }

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Created by Roshan: Facial Emotion Recognition
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo}></Avatar>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid className={classes.gridContainer} container direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && <CardActionArea>
                <CardMedia className={classes.media} image={preview} component="img" title="Uploaded Image" />
              </CardActionArea>}
              {!image && <CardContent className={classes.content}>
                <DropzoneArea acceptedFiles={['image/*']} dropzoneText={"Drag and drop an image of a human to process"} onChange={onSelectFile} />
              </CardContent>}
              {data && <CardContent className={classes.detail}>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="result table">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableCell1}>Label:</TableCell>
                        <TableCell align="right" className={classes.tableCell1}>Emoji:</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" className={classes.tableCell}>
                          {data.class}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell}>
                          {data.emoji}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>}
              {isLoading && <CardContent className={classes.detail}>
                <CircularProgress color="secondary" className={classes.loader} />
                <Typography className={classes.title} variant="h6" noWrap>
                  Processing
                </Typography>
              </CardContent>}
            </Card>
          </Grid>
          {data &&
            <Grid item>
              <Button variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
                Clear
              </Button>
            </Grid>}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
