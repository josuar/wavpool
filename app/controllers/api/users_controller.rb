class Api::UsersController < ApplicationController  
  def show
    render json: current_user, only: [:email_address, :created_at]
  end
end
