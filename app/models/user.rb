class User < ActiveRecord::Base
  validates :email_address, :password_digest, :session_token, presence: true
  validates :email_address, :session_token, uniqueness: true
  
  attr_reader :password
  validates :password, length: { minimum: 6, allow_nil: true }

  after_initialize :ensure_session_token

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

  private

  def ensure_session_token
    self.session_token = User.generate_session_token
  end
end
