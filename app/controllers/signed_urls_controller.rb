class SignedUrlsController < ApplicationController
  def index
    post = S3_BUCKET.presigned_post(
      key: "uploads/#{ SecureRandom.uuid }/${filename}",
      success_action_status: 201,
      acl: :public_read,
      content_length: 0..0xA00000 # 10 MB
    ).where(:content_type).starts_with("")
    
    render json: {
      url: post.url,
      fields: post.fields
    }
  end
end