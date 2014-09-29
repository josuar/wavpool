# == Schema Information
#
# Table name: submissions
#
#  id          :integer          not null, primary key
#  title       :string(255)      not null
#  remote_url  :string(255)      not null
#  image_url   :string(255)      not null
#  description :text
#  user_id     :integer          not null
#  created_at  :datetime
#  updated_at  :datetime
#

class Submission < ActiveRecord::Base
  include ApplicationHelper
  
  validates :image_url, :remote_url, :user, presence: true
  validate :image_url_is_valid_image
  validate :remote_url_is_valid_audio
  
  after_initialize :ensure_image

  after_save :delete_old_image
  before_destroy :delete_resources
  
  belongs_to :user

  has_many :likes, foreign_key: :likee_id
  
  has_many :comments

  def write_attribute(attr_name, value)
    @old_image = self.image_url if attr_name == 'image_url' && value != self.image_url
    @old_picture = nil if @old_picture == 'default.png'

    super
  end
  
  private
  
  def ensure_image
    self.image_url ||= 'default.png'
  end

  def delete_old_image
    S3_BUCKET.objects[@old_image].delete if @old_image
  end

  def delete_resources
    S3_BUCKET.objects[self.image_url].delete
    S3_BUCKET.objects[self.remote_url].delete
  end
  
  def image_url_is_valid_image    
    url = s3_url(self.image_url)
    
    Net::HTTP.start(url.host, url.port) do |http|
      unless http.head(url.path)['Content-Type'].start_with? 'image'
        errors.add(:image_url, 'must be a valid image')
      end
    end
  end
  
  def remote_url_is_valid_audio    
    url = s3_url(self.remote_url)
    
    Net::HTTP.start(url.host, url.port) do |http|
      unless http.head(url.path)['Content-Type'].start_with? 'audio'
        errors.add(:remote_url, 'must be a valid audio file')
      end
    end
  end
end
