# SendGrid Email Playlist Demo

This demo app shows how it is possible to create a social playlist that is entirely powered by email using [SendGrid](http://sendgrid.com) and [Rdio](http://rdio.com).  It is powered by Node.js and made real-time by socket.io.

## How it works

One person (or several if you're in different locations) open up the playlist app in their browser.  Anyone can send an email to a designated email address with the title of a song in the subject line.  The application then searches Rdio for the desired song and plays it in real-time for everyone with the page open.

## Live Example

You can see the live example at [playlist.sendgriddemos.com](http://playlist.sendgriddemos.com).  Open it in a separate window or tab and then compose an email to [playlist@sendgriddemos.com](mailto:playlist@sendgriddemos.com) with the title of a song you would like to hear in the subject line.

You can also see a [video of me](https://vimeo.com/47532398) live coding part of this and showing everyone how it works at eCommerce Hack Day in NYC (August 2012).

## Running your own copy

Impressed by what you see? Want to run your own copy? Awesome! Here's how to do that.

### 0. Preheat the oven

To run your own copy of this demo, there are a few prerequisite steps that you must complete.  For starters, you'll need to [get a free SendGrid account](http://sendgrid.com/user/signup) and [apply for an Rdio key](http://developer.rdio.com/) if you don't have them.  These can take some time and have to be manually approved, but if things are going too slow then you should tweet at them.

Once you have your SendGrid account, you'll need to set up the Parse API to point at your domain.  I'm assuming you're already past the point of registering a domain, so there are two things you'll need to do:

 1. Point the domain's MX record at `mx.sendgrid.net`
 2. Add an entry for the domain in [your parse API settings](http://sendgrid.com/developer/reply)

Again, this step may take a while since the DNS records will need to propagate, so be patient.

### 1. Get the code

Now that we have a SendGrid and an Rdio account, we can actually start working with the code.  Start by cloning the repo down to your local environment

    git clone git://github.com/theycallmeswift/playlist.sendgriddemos.com.git

### 2. Configure for deployment

My personal host of choice when it comes to anything node.js related is [Nodejitsu](http://nodejitsu.com).  This tutorial will cover how to deploy on their servers and assumes that you already have their command-line tool `jitsu` installed and your DNS pointing at their servers.  If you don't, you can follow [their getting started guide](https://github.com/nodejitsu/jitsu).

Open up the `package.json` file in your favorite editor.  The fields you'll want to change are `name`, `subdomain`, and `domains`.  I strategically placed them close to the top of the file so you could easily find them.  Replace them with the domain that you want to use:

    {
      "name": "mydomain.com",
      "version": "0.0.2",
      "subdomain": "mydomain.com",
      "domains": [
        "mydomain.com",
        "www.mydomain.com"
      ],
      // ...
    }

Next you can replace the playing domain for Rdio in `server.js`

    // Get a playback token that we can use to play songs from Rdio
    helpers.getPlaybackToken(r, 'mydomain.com', function(err, token) {
      if(err) { throw JSON.stringify(err); }

You can either manually include your SendGrid and Rdio credentials in `server.js`
or set them as environment variables on Nodejitsu using the following command

    jitsu env set VARIABLE_NAME VALUE

The variables you'll need to set are `DOMAIN`, `SENDGRID_USER`, `SENDGRID_PASS`, `RDIO_KEY`, and `RDIO_SECRET`.

### 3. Deploy

All that's left to do is to deploy the app.  We can do this by typing out

    jitsu deploy

And hopefully all will be well at this point.  You should be able to email `playlist@mydomain.com` and hear the song you requested play.  If you run into issues, feel free to open them on Github or [tweet at me](http://twitter.com/SwiftAlphaOne/) and I'll compile a FAQ.
