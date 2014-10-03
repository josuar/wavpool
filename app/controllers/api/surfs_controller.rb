class Api::SurfsController < ApplicationController
  def show
    @surf = signed_in? ?
      current_user.surf : Submission.all.order(created_at: :desc)
      
    if params[:page]
      @surf = @surf.page(params[:page]).per(10)
    else
      @surf = @surf.page(1).per(10)
    end
  end
end
