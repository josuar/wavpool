Wavpool::Application.routes.draw do
  root to: 'static#root'
  
  resource :user, only: [:new, :create]
  resource :session, only: [:new, :create, :destroy]
  
  resources :signed_urls, only: [:index]
  
  namespace :api, defaults: { format: :json } do
    resource :user, only: :show
    
    resources :profiles, only: [:show, :update] do
      resource :follow, only: [:create, :destroy]
    end
    
    resources :submissions, only: [:create, :show, :update]
  end
end
