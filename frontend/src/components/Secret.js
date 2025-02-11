import React, { useEffect } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { API_URL } from '../reuseables/urls'

import user from '../reducers/user'
import { MainContainer, SubContainer, Header, Text, Anchor, Button } from './styled-components/secret-style'

const Secret = () => {
    const accessToken = useSelector(store => store.user.accessToken)
    const secretMessage = useSelector(store => store.user.secretMessage)

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
      if (!accessToken) {
        history.push('/login')
      }
    }, [accessToken, history])

    useEffect(() => {
      if (accessToken) {
        const options = {
          method: 'GET',
          headers: {
              Authorization: accessToken
          }
        }
        fetch(API_URL('secret'), options)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              batch(() => {
                dispatch(user.actions.setSecretMessage(data.secretMessage))
                dispatch(user.actions.setErrors(null))
              })
            } else {
              dispatch(user.actions.setErrors(data))
            }
          })
      } 
    }, [accessToken, dispatch]) 

    const onButtonClick = () => {
      batch(() => {
        // remove user from localStorage
        localStorage.removeItem('user')
        dispatch(user.actions.setUsername(null));
        dispatch(user.actions.setAccessToken(null))
      })
    }

    return (
      <MainContainer>
        <SubContainer>
          <Header>
              {secretMessage}
          </Header>
          <iframe 
            src="https://giphy.com/embed/cXgGNaWiSoesw" 
            title="Party cats"
            className="giphy-embed"
            allowFullScreen
          />
          <Text>
            <Anchor 
              href="https://giphy.com/gifs/cat-party-cXgGNaWiSoesw"
            >
              via GIPHY
            </Anchor>
          </Text>
          <Button 
            onClick={onButtonClick}
          >
            Logout
          </Button>
        </SubContainer>
      </MainContainer>
    )
}

export default Secret