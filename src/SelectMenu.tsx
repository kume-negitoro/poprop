/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import Check from '@material-ui/icons/Check'
import NewFile from './Fplus.svg'
import OpenFile from './Fopen.svg'
import { RouteComponentProps, Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'
import './SelectMenu.css'
import { AppMain, Props as AppMainProps } from './AppMain'

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
        // eslint-disable-next-line react/prop-types
        props.history.push(address)
    }

    const handleChange = (name: keyof State) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setValues({ ...values, [name]: event.target.value })
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
            <Button variant="text" color="inherit">
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
                    value={values.words}
                    onChange={handleChange('words')}
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
                    value={values.filename}
                    onChange={handleChange('filename')}
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

    const mainPage = () => <AppMain projectName={values.filename} />

    return (
        <div>
            <Switch>
                <Route path="/" exact component={topPage} />
                <Route path="/NewFile" exact component={newFile} />
                <Route path="/MainApp" exact component={mainPage} />
            </Switch>
        </div>
    )
}

export default withRouter(SelectMenu)
