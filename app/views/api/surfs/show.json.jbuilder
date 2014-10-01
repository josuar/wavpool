json.submissions @surf do |submission|
  json.partial! 'api/submissions/submission', submission: submission
end