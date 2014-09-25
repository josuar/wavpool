Wavpool::Application.routes.draw do
  root to: 'static#root'
  
  resource :user, only: [:new, :create]
  resource :session, only: [:new, :create, :destroy]
  
  resources :signed_urls, only: [:index]
  
  namespace :api, defaults: { format: :json } do
    resources :profiles, only: [:show, :update]
  end
end
