Wavpool::Application.routes.draw do
  root to: 'users#new'
  
  resource :user, only: [:new, :create]
  resource :session, only: [:new, :create, :destroy]
  
  namespace :api, defaults: { format: :json } do
    resources :profiles, only: [:show, :update]
  end
end
