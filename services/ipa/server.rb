require "sinatra"
require "json"

=begin

=end

post "/" do
    logger.info 'received pst'
    request.body.rewind
    data = JSON.parse request.body.read
    for interval in data
        #logger.info interval
        for fired in interval["fired"]
            logger.info fired["name"]
        end
    end
end
