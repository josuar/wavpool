class Api::SurfsController < ApplicationController
  def show
    if signed_in?
      @surf = current_user.surf
    else
      @surf = Submission.all.order(created_at: :desc)
    end
  end
end
