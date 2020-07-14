import React, { useCallback, useEffect, useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from '../../hooks/auth'
import api from '../../services/api'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
} from './styles'

interface RouteParams {
  providerId: string
}

export interface Provider {
  id: string
  name: string
  avatar_url: string
}

const CreateAppointment: React.FC = () => {
  const route = useRoute()

  const routeParams = route.params as RouteParams

  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  )
  const [providers, setProviders] = useState<Provider[]>([])

  const { user } = useAuth()
  const { goBack } = useNavigation()

  useEffect(() => {
    api
      .get('/providers')
      .then(response => {
        setProviders(response.data)
      })
      .catch(err => {
        throw new Error(err.message)
      })
  })

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const handleSelectedProviderChange = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          data={providers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => handleSelectedProviderChange(provider.id)}
              selected={provider.id === selectedProvider}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
    </Container>
  )
}

export default CreateAppointment