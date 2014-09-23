Wavpool::Application.routes.draw do
  root to: "static#root"
  
  resource :user, only: [:new, :create]
  resource :session, only: [:new, :create, :destroy]
  
  namespace :api, defaults: { format: :json } do
  end
end
