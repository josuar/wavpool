# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  email_address   :string(255)      not null
#  password_digest :string(255)      not null
#  session_token   :string(255)      not null
#  created_at      :datetime
#  updated_at      :datetime
#

class User < ActiveRecord::Base
  validates :email_address, :password_digest, :session_token, presence: true
  validates :email_address, :session_token, uniqueness: true
  
  attr_reader :password
  validates :password, length: { minimum: 6, allow_nil: true }

  after_initialize :ensure_session_token
  
  has_one :profile, dependent: :destroy, autosave: true
  has_many :submissions, dependent: :destroy
  
  has_many :in_follows, class_name: "Follow", foreign_key: :followee_id
  has_many :out_follows, class_name: "Follow", foreign_key: :follower_id  
  has_many :followers, through: :in_follows, source: :follower
  has_many :followees, through: :out_follows, source: :followee

  has_many :out_likes, class_name: "Like", foreign_key: :liker_id
  has_many :likes, through: :out_likes, source: :likee
  
  has_many :comments

  def self.generate_session_token
    SecureRandom.urlsafe_base64(32)
  end

  def self.find_by_credentials(email_address, password)
    user = User.find_by_email_address(email_address)

    user && user.is_password?(password) ? user : nil
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def reset_session_token!
    self.update(session_token: User.generate_session_token)
  end
  
  def follows?(user)
    self.followees.include?(user)
  end

  def likes?(submission)
    self.likes.include?(submission)
  end
  
  def feed
    Submission.
      joins(:user).
      joins("LEFT OUTER JOIN follows ON users.id = follows.followee_id").
      where(
        "follows.follower_id = :id",
        id: self.id
      ).order(created_at: :desc)
  end
  
  def surf
    Submission.
      joins(:user).
      where(
        "submissions.user_id <> :id",
        id: self.id
      ).order(created_at: :desc)
  end
  
  def recommended_users
    Profile.
      select("profiles.*, COUNT(submissions.id) AS submission_count").
      joins(:submissions).
      joins(user: :in_follows).
      where("users.id <> :id AND follows.follower_id <> :id", id: self.id).
      group("profiles.id").
      order("submission_count DESC").
      limit(3)
  end
  
  def recent_likes
    Submission.   
      joins("INNER JOIN likes ON submissions.id = likes.likee_id").
      joins("INNER JOIN users ON users.id = likes.liker_id").
      where(
        "submissions.user_id <> :id AND likes.liker_id = :id",
        id: self.id
      ).
      order(created_at: :desc).
      limit(3)
  end
  
  def recent_comments
    comments.includes(:user).includes(:submission).order(created_at: :desc).limit(3)
  end

  private

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end
end
