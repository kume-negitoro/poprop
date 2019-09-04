/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import {
    makeStyles,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import Check from '@material-ui/icons/Check'
import NewFile from './Fplus.svg'
import OpenFile from './Fopen.svg'
import { RouteComponentProps, Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AppMain, Props as AppMainProps, ProjectData } from './AppMain'
import './SelectMenu.css'
import { string } from 'prop-types'

interface State {
    words: string
    filename: string
}

const useStyles = makeStyles(theme => ({
    CheckButton: {
        backgroundColor: 'lightgreen',
    },
}))

const SelectMenu: React.FC<RouteComponentProps> = (props): JSX.Element => {
    const classes = useStyles()

    const [values, setValues] = useState<State>({
        words: '3',
        filename: '',
    })

    const handlePageChange = (address: string) => {
        props.history.push({
            pathname: address,
            state: {
                filename: values.filename,
                words: values.words,
            },
        })
    }

    const handleChange = (name: keyof State) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setValues({ ...values, [name]: event.target.value })
    }
    const handleButton = (
        name: keyof State,
        value: string,
        address: string
    ) => () => {
        setValues({ ...values, [name]: value })
        props.history.push({ pathname: address })
    }

    const projects = (JSON.parse(
        localStorage.getItem('projects') || '{}'
    ) as unknown) as Record<string, ProjectData>

    function generate() {
        const keys: string[] = Object.keys(projects)
        if (keys.length == 0) {
            return (
                <ListItem>
                    <Card className="ListContent">
                        <ListItemText
                            className="ListContentText"
                            primary="プロジェクトがありません"
                        />
                    </Card>
                </ListItem>
            )
        }
        return keys.map(v => (
            <ListItem>
                <Card className="ListContent">
                    <ListItemText className="ListContentText" primary={v} />
                    <ListItemSecondaryAction className="ListContentButton">
                        <Button
                            variant="outlined"
                            defaultValue={v}
                            onClick={handleButton('filename', v, '/MainApp')}
                        >
                            開く
                        </Button>
                    </ListItemSecondaryAction>
                </Card>
            </ListItem>
        ))
    }

    const topPage = () => (
        <div>
            <Button
                variant="text"
                color="inherit"
                onClick={() => handlePageChange('/NewFile')}
            >
                <Container className="ButtonContainer">
                    <img className="ButtonImage" src={NewFile} />
                    <p className="ButtonText">新規プロジェクト</p>
                </Container>
            </Button>
            <Button
                variant="text"
                color="inherit"
                onClick={() => handlePageChange('/ExistingFile')}
            >
                <Container className="ButtonContainer">
                    <img className="ButtonImage" src={OpenFile} />
                    <p className="ButtonText">既存プロジェクト</p>
                </Container>
            </Button>
            <br />
            <br />
            <div className="WordCount">
                ワード数
                <TextField
                    className="WordCountInput"
                    inputProps={{ style: { textAlign: 'right' } }}
                    type="number"
                    defaultValue={values.words}
                    onBlur={handleChange('words')}
                />
            </div>
        </div>
    )

    const newFile = () => (
        <Card>
            <CardContent>
                <TextField
                    className="FileName"
                    label="プロジェクト名"
                    defaultValue={values.filename}
                    onBlur={handleChange('filename')}
                />
            </CardContent>
            <CardActions className="CardButton">
                <IconButton
                    onClick={() => handlePageChange('/MainApp')}
                    className={classes.CheckButton}
                >
                    <Check htmlColor="white" />
                </IconButton>
                <IconButton onClick={() => handlePageChange('/')}>
                    <Close />
                </IconButton>
            </CardActions>
        </Card>
    )

    const existingFile = () => (
        <div className="List">
            ファイル一覧
            <List component="nav">{generate()}</List>
        </div>
    )

    const mainPage = () => <AppMain projectName={values.filename} />

    return (
        <div>
            <Switch>
                <Route path="/" exact component={topPage} />
                <Route path="/NewFile" exact component={newFile} />
                <Route path="/ExistingFile" exact component={existingFile} />
                <Route path="/MainApp" exact component={mainPage} />
            </Switch>
        </div>
    )
}

export default withRouter(SelectMenu)
