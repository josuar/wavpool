# == Schema Information
#
# Table name: profiles
#
#  id           :integer          not null, primary key
#  user_id      :string(255)      not null
#  display_name :string(255)      not null
#  full_name    :string(255)
#  location     :string(255)
#  description  :text
#  created_at   :datetime
#  updated_at   :datetime
#  picture_url  :string(255)
#

class Profile < ActiveRecord::Base  
  include ApplicationHelper
  
  validates :picture_url, :display_name, presence: true
  validate :picture_url_is_valid_image
  
  after_initialize :ensure_picture
  after_save :delete_old_picture
  before_destroy :delete_resources
  
  belongs_to :user
  has_many :submissions, through: :user, source: :submissions

  def write_attribute(attr_name, value)
    @old_picture = self.picture_url if attr_name == 'picture_url'

    super
  end
  
  private
  
  def ensure_picture
    self.picture_url ||= 'default.gif'
  end

  def delete_old_picture
    S3_BUCKET.objects[@old_picture].delete if @old_picture
  end

  def delete_resources
    S3_BUCKET.objects[self.image_url].delete
    S3_BUCKET.objects[self.remote_url].delete
  end
  
  def picture_url_is_valid_image
    url = s3_url(self.picture_url)
    
    Net::HTTP.start(url.host, url.port) do |http|
      unless http.head(url.path)['Content-Type'].start_with? 'image'
        errors.add(:picture_url, 'must be a valid image')
      end
    end
  end
end
