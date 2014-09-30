class ChangeProfileUserIdToInteger < ActiveRecord::Migration
  def change
    execute %q{
      ALTER TABLE profiles
      ALTER COLUMN user_id
        type int USING cast(user_id as int)
    }
  end
end
