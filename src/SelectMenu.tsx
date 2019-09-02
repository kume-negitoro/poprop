import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import './SelectMenu.css'
import Close from '@material-ui/icons/Close'
import Check from '@material-ui/icons/Check'
import NewFile from './Fplus.svg'
import OpenFile from './Fopen.svg'

interface State {
    words: string
    filename: string
    saveaddress: string
}

const SelectMenu: React.FC = (): JSX.Element => {
    const [mode, setMode] = useState(0)

    const [values, setValues] = useState<State>({
        words: '3',
        filename: '',
        saveaddress: '',
    })

    const handleChange = (name: keyof State) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setValues({ ...values, [name]: event.target.value })
    }

    return (
        <div>
            {mode == 0 && (
                <div>
                    <Button
                        variant="text"
                        color="inherit"
                        onClick={() => setMode(1)}
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
                            defaultValue="3"
                        />
                    </div>
                </div>
            )}
            {mode == 1 && (
                <Card>
                    <CardContent>
                        <TextField
                            className="FileName"
                            label="プロジェクト名"
                            value={values.filename}
                            onChange={handleChange('filename')}
                        />
                        <br />
                        <TextField
                            className="FileName"
                            label="保存先"
                            value={values.saveaddress}
                            onChange={handleChange('saveaddress')}
                        />
                    </CardContent>
                    <CardActions className="CardButton">
                        <IconButton color="primary">
                            <Check />
                        </IconButton>
                        <IconButton color="inherit" onClick={() => setMode(0)}>
                            <Close />
                        </IconButton>
                    </CardActions>
                </Card>
            )}
        </div>
    )
}

export default SelectMenu
